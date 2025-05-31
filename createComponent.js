const vscode = require('vscode');
const fs = require("fs");
const path = require('path');
const pageTemplate = require('./templates/pageTemplate');

async function getTemplate(context){
    
        const templatesDir = path.join(context.globalStoragePath, "templates", "custom", "components");

        if (!fs.existsSync(templatesDir)) {
            vscode.window.showErrorMessage("No saved templates found.");
            return null;
        }

        const templates = fs.readdirSync(templatesDir);
        
        const templatePageChoice = await vscode.window.showQuickPick(
            templates,
            { placeHolder: 'Choose component template to create' }
        );

        const templatePath = path.join(templatesDir, templatePageChoice);
        const template = require(templatePath);

        return template;

}

async function createComponent(currdir, context) {

    const templateChoice = await vscode.window.showQuickPick(
        ['Create Basic Component', 'Create Component from Template'],
        { placeHolder: 'Choose component creation option' }
    );  

    const compNameInput = await vscode.window.showInputBox({ placeHolder: "Enter page name: " });
    if (!compNameInput) {
        vscode.window.showErrorMessage("Component name is required!");
        return;
    }

    const compName = compNameInput.charAt(0).toUpperCase() + compNameInput.slice(1); 
    const componentspath = path.join(currdir, "app", "components");

    const filepath = path.join(componentspath, compName + ".jsx");


    if(!fs.existsSync(filepath)){


        if (templateChoice === 'Create Basic Component') {

            if (!fs.existsSync(componentspath)) {
                fs.mkdirSync(componentspath, { recursive: true });
            }

            fs.writeFileSync(filepath, pageTemplate(compName));

        }
        else if (templateChoice === 'Create Component from Template') {

            const template = await getTemplate(context);

            fs.mkdirSync(componentspath, { recursive: true });
            fs.writeFileSync(filepath, template());
        }

        vscode.window.showInformationMessage("Component created successfully.");
    }
    else{
        vscode.window.showErrorMessage("Component already exist!");
    }
}


module.exports = { createComponent };