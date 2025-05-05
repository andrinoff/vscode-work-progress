// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import status from './time/status';
import login from './email/login';
import checkScreenTime from './screentime/check_screen_time';

import setGoal from './time/setGoal';
import sessionEnd from './email/session_end';

// This method is called when extension is activated
// extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	//  Updating the settings
	if(vscode.workspace.getConfiguration("work-progress").get<string>("apiKey") !== context.globalState.get("apiKey")) {
	context.globalState.update("apiKey", vscode.workspace.getConfiguration("work-progress").get<string>("apiKey"));
	}
	// Checking if the user is logged in
	if (vscode.workspace.getConfiguration("work-progress").get<string>("apiKey") === undefined || vscode.workspace.getConfiguration("work-progress").get<string>("apiKey") === "" || context.globalState.get("apiKey") === undefined || context.globalState.get("apiKey") === "") {
		vscode.window.showInformationMessage("Please log in to Work Progress to use email notifications. You can do it on https://vswork-progress.vercel.app or https://andrinoff.github.io/workprogress/");
	}
	// This log helps with cathing errors at the startup
	console.log('Congratulations, your extension "work-progress" is now active!');
	// Send the email with the time worked
	checkScreenTime(context);
	if (context.globalState.get("time_worked") !== undefined && context.globalState.get("time_worked") !== "0" && vscode.workspace.getConfiguration("work-progress").get<boolean>("session", false)) {
		console.log("sending email for time worked: " + context.globalState.get("time_worked"));
	sessionEnd(context, parseInt(context.globalState.get("time_worked") || "0") / 60);
	context.globalState.update("time_worked", "0");

	}
	
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
// This method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext) {
	// sessionEnd(context, context.globalState.get("time_worked") || 0);
	// Clear the global state
	console.log("time worked: " + context.globalState.get("time_worked"));
	// This log helps with cathing errors at the shutdown
	;
	
}
