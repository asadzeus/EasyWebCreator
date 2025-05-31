const vscode = require("vscode");

async function runApp(currdir) {
    const terminal = vscode.window.createTerminal({name: "App Run", cwd: currdir});

	if(terminal){
		terminal.sendText(`npm run dev`);
		terminal.show();

		const newTerminal = vscode.window.createTerminal();
		newTerminal.sendText(`start http://localhost:3000`);
		setTimeout(() => {
			newTerminal.dispose();
		}, 3000);
		
		
	}
	else{
		vscode.window.showErrorMessage("No active project path to run!");
	}


}

module.exports = {runApp}