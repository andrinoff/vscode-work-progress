import * as vscode from 'vscode';

export default async function login(context: vscode.ExtensionContext): Promise<void> {
    const email_input = await vscode.window.showInputBox({
        prompt: 'Enter your email',
        placeHolder: 'name@example.com',
    });

    if (!email_input) {
        vscode.window.showErrorMessage('Please set your email and password in the settings.');
        return;
    }

    if (!email_input.includes('@')) {
        vscode.window.showErrorMessage('Please enter a valid email address.');
        return;
    }

    context.globalState.update('email', email_input);
    console.log("writing email");

    try {
        const response = await fetch('https://server-work-progress.vercel.app/api/welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email_input })
        });
        console.log(response);
        
        vscode.window.showInformationMessage('Email sent successfully!');
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to send email: ${error}`);
    }
}