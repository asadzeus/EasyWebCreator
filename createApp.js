const path = require("path");
const vscode = require("vscode");
const fs = require("fs-extra");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

const templateRepo = "https://github.com/asadzeus/ewcbase2.0";


async function createApp(currdir) {


    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Creating new app ",
            cancellable: false,
        }, async (progress) => {
            const steps = [
                { message: "Cloning the project...", action: async () => await execPromise(`git clone ${templateRepo}`, { cwd: currdir }) },
                { message: "Copying files...", action: async () => fs.copySync(path.join(currdir, "ewcbase2.0"), currdir) },
                { message: "Removing temporary files...", action: async () => fs.removeSync(path.join(currdir, "ewcbase2.0")) },
                { message: "Installing dependencies... (it may take a while)", action: async () => await execPromise(`npm install`, { cwd: currdir }) }
            ];

            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                progress.report({ message: step.message, increment: (100 / steps.length) });
                await step.action();
            }

            vscode.window.showInformationMessage("App created successfully.");
        });
    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage("App creation failed: " + error.message);
    }
}

module.exports = { createApp };
