// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import clockIn from './time/clockin';
import clockOut from './time/clockout';
import status from './time/status';
// This method is called when extension is activated
// extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// This log helps with cathing errors at the startup
	console.log('Congratulations, your extension "work-progress" is now active!');

	const login = "work-progress.login";
	const login_command = async (name:string = "Login to Work Progress") => {
		const result = await vscode.window.showInputBox({
			placeHolder: 'Enter your login:',
		});
		console.log(result);
	};	

	const disposable = vscode.commands.registerCommand('work-progress.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Work Progress has been loaded correctly!');
	});

	context.subscriptions.push(
		disposable, 
		vscode.commands.registerCommand(login, login_command), 
		vscode.commands.registerCommand('work-progress.clockIn', () => clockIn(context)), 
		vscode.commands.registerCommand('work-progress.clockOut', () => clockOut(context)),
		vscode.commands.registerCommand('work-progress.status', () => status(context))
	);
}
// This method is called when your extension is deactivated
export function deactivate() {
	// This log helps with cathing errors at the shutdown
	console.log('Work Progress has been deactivated!');
}
