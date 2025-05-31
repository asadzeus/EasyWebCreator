const vscode = require("vscode");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

async function pushDatabase(currdir, migName) {
    let migrationName = migName;

    if (!migrationName) {
        migrationName = await vscode.window.showInputBox({ placeHolder: "Enter migration name:" });
    }

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Pushing Database",
        cancellable: false
    }, async (progress) => {
        const steps = [
            {
                message: "Generating Prisma client...",
                action: async () => {
                    await execPromise(`npx prisma generate`, { cwd: currdir });
                }
            },
            {
                message: "Migrating database...",
                action: async () => {
                    try {
                        const { stdout } = await execPromise(`npx prisma migrate dev --name ${migrationName}`, { cwd: currdir, env: process.env });
                        vscode.window.showInformationMessage("Migration successful:\n" + stdout);
                    } catch (err) {
                        vscode.window.showErrorMessage("Migration failed. Check 'Prisma' output panel.");
                        const output = vscode.window.createOutputChannel("Prisma");
                        output.appendLine(err.stdout || "");
                        output.appendLine(err.stderr || err.message || String(err));
                        output.show(true);
                        throw err;
                    }
                }
            }
        ];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            progress.report({ message: step.message, increment: 100 / steps.length });
            await step.action();
        }
    });
}

module.exports = { pushDatabase };
