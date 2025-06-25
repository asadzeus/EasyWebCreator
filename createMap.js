const vscode = require('vscode');
const fs = require("fs");
const path = require('path');
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

const mapSectionTemplate = require('./templates/map/mapSectionTemplate.js');
const mapSectionParentTemplate = require('./templates/map/mapTemplate.js');

const {IsInstalled} = require("./checkInstallation.js")


async function createMap(currdir){ 

    
    return await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Creating map",
        cancellable: false, 
    },
    async (progress) => {
        const steps = [
            { message: "Installing leaflet...", action: async () => 
                {
                    if(!IsInstalled("leaflet")){
                        await execPromise(`npm install leaflet`, { cwd: currdir, shell: true })
                    }
                }
            },

            { message: "Installing react-leaflet...", action: async () => 
                {
                    if(!IsInstalled("react-leaflet")){
                        await execPromise(`npm install react-leaflet@4.2.1`, { cwd: currdir, shell: true })
                    }
                }
            },

            { message: "Installing leaflet-defaulticon-compatibility...", action: async () => 
                {
                    if(!IsInstalled("leaflet-defaulticon-compatibility")){
                        await execPromise(`npm install leaflet-defaulticon-compatibility`, { cwd: currdir, shell: true })
                    }
                }
            },

            { message: "Writing leaflet templates...", action: async () => 
                {
                    const mapsFolder = path.join(currdir, "app", "components", "map");
                    const mapSectionFile = path.join(currdir, "app", "components", "map", "MapSection.jsx");
                    const mapSectionParentFile = path.join(currdir, "app", "components", "map", "Map.jsx");

                    if(!fs.existsSync(mapsFolder)){
                        fs.mkdirSync(mapsFolder, { recursive: true});
                    }
                    
                    fs.writeFileSync(mapSectionFile, mapSectionTemplate());
                    fs.writeFileSync(mapSectionParentFile, mapSectionParentTemplate());
                }
            },

        ];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            progress.report({ message: step.message, increment: (100 / steps.length) });
            await step.action();
        }

        vscode.window.showInformationMessage("Map installed successfully.");
        
        }
    );




}

module.exports = { createMap };