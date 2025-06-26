const path = require('path');
const vscode = require('vscode');
const fs = require("fs");


async function createApiCall(currdir) {

    try {
        const apiName = await vscode.window.showInputBox({ placeHolder: "Enter api name: " });
        
        const apiFolder = path.join(currdir, "app", "api", apiName);
        const apiFile = path.join(apiFolder, "route.js");

        if(!fs.existsSync(apiFolder)){

        const methodName = await vscode.window.showQuickPick(
            ["GET", "POST"],
            { placeHolder: "Select HTTP method" }
        );


        let apiTemplate = "";
        if(methodName == "GET"){
            apiTemplate = require('./templates/api/GetTemplate');
        }
        else if(methodName == "POST"){
            apiTemplate = require('./templates/api/PostTemplate');
        }

        fs.mkdirSync(apiFolder, { recursive: true });
        const content = apiTemplate();

        fs.writeFileSync(apiFile, content);

        }
        else{
            vscode.window.showErrorMessage("Api already exist!!!");
        }
    } 
    catch (error) {
        vscode.window.showErrorMessage(error);
    }


    
}

module.exports= {createApiCall}