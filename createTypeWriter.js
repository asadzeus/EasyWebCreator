const vscode = require("vscode");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const {IsInstalled} = require("./checkInstallation");

async function createTypeWriter(currdir) {

    if(!IsInstalled(currdir, "typewriter-effect")){
        vscode.window.showInformationMessage("Type writer is not installed. Starting to install...");
        
        vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Type Writer Installation ",
        cancellable: false

        }, async (progress) =>{

        const steps = [
            { message: "Installing packages for Type Writer...", action: async () => await execPromise(`npm install typewriter-effect`, { cwd: currdir })},
        ];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            progress.report({ message: step.message, increment: (100 / steps.length) });
            await step.action();
        }

        vscode.window.showInformationMessage("Type Writer installed.");
    
        });
    }
    else{
        vscode.window.showInformationMessage("Type writer already installed.");
    }

}

module.exports = {createTypeWriter}