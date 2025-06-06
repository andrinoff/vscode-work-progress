// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import status from './time/status';
import login from './email/login';
import checkScreenTime from './screentime/check_screen_time';

import setGoal from './time/setGoal';
import sessionEnd from './email/session_end';
import updateLatest from './time/Latest';

let updateBackendIntervalId: NodeJS.Timeout | null = null;

// This method is called when extension is activated
// extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	//  Updating the settings
	if(vscode.workspace.getConfiguration("work-progress").get<string>("apiKey") !== context.globalState.get("apiKey")) {
	context.globalState.update("apiKey", vscode.workspace.getConfiguration("work-progress").get<string>("apiKey"));
	}
	// Checking if the user is logged in
	if (vscode.workspace.getConfiguration("work-progress").get<string>("apiKey") === undefined || vscode.workspace.getConfiguration("work-progress").get<string>("apiKey") === "" || context.globalState.get("apiKey") === undefined || context.globalState.get("apiKey") === "") {
		vscode.window.showInformationMessage("Please log in to Work Progress to use email notifications. ", "Log in", "API key").then((selection) => {
			if (selection === "Log in") {
				vscode.env.openExternal(vscode.Uri.parse("https://work-progress.github.io/account/signin.html"));
			} else if (selection === "API key") {
				login(context);
			}
		}) ;
	}
	// This log helps with cathing errors at the startup
	console.log('Congratulations, your extension "work-progress" is now active!');
	// Send the email with the time worked
	checkScreenTime(context);

	updateBackendIntervalId = setInterval(() => {
		const apiKey = context.globalState.get("apiKey");
		const timeWorked = parseInt(context.globalState.get("time_worked") || "0") || 0;
		if (timeWorked != 0) {
			updateLatest(JSON.stringify(apiKey), timeWorked);
		}
		// Send the time worked to the server every minute
	}, 60000);
	
	const disposable = vscode.commands.registerCommand('work-progress.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Work Progress has been loaded correctly!');
	});

	context.subscriptions.push(
		disposable, 
		vscode.commands.registerCommand('work-progress.setGoal', () => setGoal(context)),
		vscode.commands.registerCommand("work-progress.login", () => login(context) ), 
		vscode.commands.registerCommand('work-progress.status', () => status(context))
	);
}
