const path = require("path");
const vscode = require("vscode");
const fs = require("fs");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const {IsInstalled} = require("./checkInstallation");

async function createToasts(currdir) {

    return vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Toast Installation ",
        cancellable: false
    }, async (progress) =>{
        const steps = [
            { message: "Installing packages for toasts...", action: async () => {
                if(!IsInstalled(currdir, "react-hot-toast")){
                    await execPromise(`npm install react-hot-toast`, { cwd: currdir });
                }
                else{
                    vscode.window.showInformationMessage("Toasts already installed.");
                }

            }},
            { message: "Writing to layout...", action: async () => {

                const toastPosition = await vscode.window.showQuickPick(
                    ["Top-Left", "Top-Center", "Top-Right", "Bottom-Left", "Bottom-Center", "Bottom-Right"],
                    { placeHolder: "Select toast position" }
                );

                const layoutPagePath = path.join(currdir, "app", "layout.jsx");
                let layoutContent = fs.readFileSync(layoutPagePath, "utf-8");

                const importRegex = /import\s*{\s*Toaster\s*}/g;
                const itemRegex = /<(Toaster([\s\S])*)\/>/g;
                
                if(layoutContent.toString().search(importRegex) == -1){
                    layoutContent = "import { Toaster } from 'react-hot-toast'; \n" + layoutContent;
                }

                if(layoutContent.toString().search(itemRegex) == -1){          
                    layoutContent = layoutContent.replace(`{children}`, `<Toaster position="${toastPosition.toLowerCase()}" /> \n {children}`)
                }
                else{
                    layoutContent = layoutContent.replace(itemRegex, `<Toaster position="${toastPosition.toLowerCase()}" />`)
                }
                fs.writeFileSync(layoutPagePath, layoutContent);
            }},

        ];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            progress.report({ message: step.message, increment: (100 / steps.length) });
            await step.action();
        }

        vscode.window.showInformationMessage("Toast installed.");
    
    });

}

module.exports = {createToasts}