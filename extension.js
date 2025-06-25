const vscode = require('vscode');

// importing each module
const {createApp} = require("./createApp");
const {runApp} = require("./runApp");
const {createPage} = require("./createPage");
const {createComponent} = require("./createComponent");
const {createDatabase} = require("./createDatabase");
const {pushDatabase} = require("./pushDatabase");
const {createApiCall} = require("./createApiCall");
const {createAuthentication} = require("./createAuthentication");
const {createToasts} = require("./createToasts");
const {saveTemplate} = require("./saveTemplate");
const {createTypeWriter} = require("./createTypeWriter");
const {createPayment} = require("./createPayment");
const {createMap} = require("./createMap");

const currdir = vscode.workspace.workspaceFolders[0].uri.fsPath;


// vsce package ; code --install-extension easywebcreator-0.0.1.vsix (our extension installation code)

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {


	const createapp = vscode.commands.registerCommand("easywebcreator.createapp", async function(){
		createApp(currdir);
	});

	const runapp = vscode.commands.registerCommand("easywebcreator.runapp", function(){
		runApp(currdir);
	});

	const createpage = vscode.commands.registerCommand("easywebcreator.createpage", async function(){
		createPage(currdir, context);
	})

	const createcomponent = vscode.commands.registerCommand("easywebcreator.createcomponent", async function(){
		createComponent(currdir, context);
	})

	const createDb = vscode.commands.registerCommand("easywebcreator.createdb", async function(){
		createDatabase(currdir);
	})

	const pushDb = vscode.commands.registerCommand("easywebcreator.pushdb", async function(){
		pushDatabase(currdir);
	})

	const createapicall = vscode.commands.registerCommand("easywebcreator.createapicall", async function(){
		createApiCall(currdir);
	})

	const createauth = vscode.commands.registerCommand("easywebcreator.createauthentication", async function(){
		createAuthentication(currdir);
	})

	const createtoasts = vscode.commands.registerCommand("easywebcreator.createtoasts", async function(){
		createToasts(currdir);
	})

	const savetemplate = vscode.commands.registerCommand("easywebcreator.savetemplate", async function(){
		saveTemplate(context);
	})

	const createtypewriter = vscode.commands.registerCommand("easywebcreator.createtypewriter", async function(){
		createTypeWriter(currdir);
	})

	const createpayment = vscode.commands.registerCommand("easywebcreator.createpayment", async function(){
		createPayment(currdir);
	})

	const createmap = vscode.commands.registerCommand("easywebcreator.createmap", async function(){
		createMap(currdir);
	})

	context.subscriptions.push(createapp);
	context.subscriptions.push(runapp);
	context.subscriptions.push(createpage);
	context.subscriptions.push(createcomponent);
	context.subscriptions.push(createDb);
	context.subscriptions.push(pushDb);
	context.subscriptions.push(createapicall);
	context.subscriptions.push(createauth);
	context.subscriptions.push(createtoasts);
	context.subscriptions.push(savetemplate);
	context.subscriptions.push(createtypewriter);
	context.subscriptions.push(createpayment);
	context.subscriptions.push(createmap);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
