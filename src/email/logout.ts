import * as vscode from 'vscode';

export default function logout(context: vscode.ExtensionContext): void {
    const email = context.globalState.get<string>('email');
    if (email) {
        context.globalState.update('email', undefined);
        vscode.window.showInformationMessage('Logged out successfully.');
    } else {
        vscode.window.showErrorMessage('No user is currently logged in.');
    }
}