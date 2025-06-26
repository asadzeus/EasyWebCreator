const { exec } = require("child_process");
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const util = require("util");
const execPromise = util.promisify(exec);
const {IsInstalled} = require("./checkInstallation")

const schemaTemplate = require("./templates/auth/schemaTemplate");
const myclientTemplate = require("./templates/auth/myclientTemplate");


async function createDatabase(currdir) {
    /*const DbUserName = await vscode.window.showInputBox({ placeHolder: "Enter DB user name: " });
    const DbPassword = await vscode.window.showInputBox({ placeHolder: "Enter DB password: " });
    const DbName = await vscode.window.showInputBox({ placeHolder: "Enter Database name: " });*/

    return await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Setting up database with Prisma ",
        cancellable: false
    }, async (progress) => {
        const steps = [
            { message: "Installing prisma...", action: async () => {
                if(!IsInstalled("prisma")){
                    await execPromise(`npm install prisma --save-dev`, { cwd: currdir }) 
                }
            }},
            { message: "Installing prisma client...", action: async () => {
                if(!IsInstalled("@prisma/client")){
                    await execPromise(`npm install @prisma/client`, { cwd: currdir }) 
                }
            }},
            { message: "Installing prisma accelerate...", action: async () => {
                if(!IsInstalled("@prisma/extension-accelerate")){
                    await execPromise(`npm install @prisma/extension-accelerate`, { cwd: currdir }) 
                }
            }},
            { message: "Initializing prisma...", action: async () => {
                const schemaDir = path.join(currdir, "prisma");
                const schemaPath = path.join(currdir, "prisma", "schema.prisma");
                const myclientPath = path.join(currdir, "prisma", "myclient.js");

                fs.mkdirSync(schemaDir, {recursive: true});
                fs.writeFileSync(schemaPath, schemaTemplate());
                fs.writeFileSync(myclientPath, myclientTemplate());
            } },
            
            {message: "Writing .env file...", action: async () => {
                const envPath = path.join(currdir, ".env");
                if (!fs.existsSync(envPath)) {
                    fs.writeFileSync(envPath, "");
                }
                let envContent = fs.readFileSync(envPath, "utf-8");
                const dbUrlRegex = /DATABASE_URL([\s\S]*)"/g;
                const directUrlRegex = /DIRECT_URL([\s\S]*)"/g;
        
                //const dbUrl = `mysql://${DbUserName}:${DbPassword}@localhost:3306/${DbName}`;
                
                if (envContent.search("DATABASE_URL") === -1) {
                    envContent += `\nDATABASE_URL=""`;
                } else {
                    envContent = envContent.replace(dbUrlRegex, `DATABASE_URL=""`);
                }
                if (envContent.search("DIRECT_URL") === -1) {
                    envContent += `\DIRECT_URL=""`;
                } else {
                    envContent = envContent.replace(directUrlRegex, `DIRECT_URL=""`);
                }
        
                fs.writeFileSync(envPath, envContent);}
            },

        ];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            progress.report({ message: step.message, increment: (100 / steps.length) });
            await step.action();
        }

        vscode.window.showInformationMessage("Database created successfully!");

    });
}

module.exports = { createDatabase };
