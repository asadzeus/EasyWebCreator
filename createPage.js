const vscode = require('vscode');
const fs = require("fs");
const path = require('path');
const pageTemplate = require('./templates/pageTemplate');


async function getTemplate(context){
    
        const templatesDir = path.join(context.globalStoragePath, "templates", "custom", "pages");

        if (!fs.existsSync(templatesDir)) {
            vscode.window.showErrorMessage("No saved templates found.");
            return null;
        }

        const templates = fs.readdirSync(templatesDir);
        
        const templatePageChoice = await vscode.window.showQuickPick(
            templates,
            { placeHolder: 'Choose page template to create' }
        );

        const templatePath = path.join(templatesDir, templatePageChoice);
        const template = require(templatePath)

        return template;

}


async function createPage(currdir, context){ 
    
    let pageName = "";
    let pagepath = "";

    const templateChoice = await vscode.window.showQuickPick(
        ['Create Basic Page', 'Create Page from Template'],
        { placeHolder: 'Choose page creation option' }
    );  

    pageName = await vscode.window.showInputBox({placeHolder: "Enter page name: "});
    
    if (!pageName) {
        vscode.window.showErrorMessage("Page name is required!");
        return;
    }

    let folders;
    let lastfolder;
    
    if(pageName.includes("/")){
        folders = pageName.split("/");
        lastfolder = folders[folders.length - 1]
    }
    
    //pageName = pageName.toLowerCase();
    pagepath = path.join(currdir, "app", pageName);

    // creating the ".jsx" file
    if(!fs.existsSync(pagepath)){

        const jxsfilepath = path.join(pagepath, "page.jsx");

        if (templateChoice === 'Create Basic Page') {
            fs.mkdirSync(pagepath, { recursive: true });
            fs.writeFileSync(jxsfilepath, pageTemplate(lastfolder));
        }
        else if (templateChoice === 'Create Page from Template') {
            const template = await getTemplate(context);
            fs.mkdirSync(pagepath, { recursive: true });
            fs.writeFileSync(jxsfilepath, template());
        }
        
        vscode.window.showInformationMessage("Page created successfully.");
        
    }
    else{
        vscode.window.showErrorMessage("Page already exist!");
    }
        
}

module.exports = {createPage};