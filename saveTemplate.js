const path = require("path");
const fs = require("fs");
const vscode = require("vscode");

async function saveSelectedFile(pageContent, context) {

    try {
        const fileName = await vscode.window.showInputBox({placeHolder: "Enter template name to save: "}); 

        const templateType = await vscode.window.showQuickPick(
            ["Page", "Component"],
            {
            placeHolder: "Select template type"
        });
        
        let templateDirPath = "";
        if(templateType == "Page"){
            templateDirPath = path.join(context.globalStoragePath, "templates", "custom", "pages");
        }
        else if(templateType == "Component"){
            templateDirPath = path.join(context.globalStoragePath, "templates", "custom", "components");
        }

        const templateFilePath = path.join(templateDirPath, fileName + "Template.js");

        if(!fs.existsSync(templateFilePath)){

            if(!fs.existsSync(templateDirPath)){
                fs.mkdirSync(templateDirPath, { recursive: true });
            }
            
            const finalContent = `module.exports = () => \`${pageContent}\n\`;`;

            fs.writeFileSync(templateFilePath, finalContent);

            vscode.window.showInformationMessage(templateType + " template saved successfully.");
        }
        else
        {
            vscode.window.showErrorMessage("Template already exist!");
        }
        
    } 
    catch (error) {
        vscode.window.showErrorMessage(error);
    }
    

}

async function saveTemplate(context) {

    if(vscode.window.activeTextEditor.document.languageId == "javascriptreact"){
        
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const filePath = editor.document.uri.fsPath;
        let pageContent = "";

        try {
            pageContent = fs.readFileSync(filePath, "utf-8");
            saveSelectedFile(pageContent, context);
        } 
        catch (error) {
            vscode.window.showErrorMessage(error);
        }
    
    }
    else{
        vscode.window.showErrorMessage("You can save .jsx files!");
    }
    
}

module.exports = {saveTemplate}