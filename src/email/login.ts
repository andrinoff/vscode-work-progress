import * as vscode from 'vscode';

export default function login(context: vscode.ExtensionContext): void {
    const email_input = vscode.window.showInputBox({
        prompt: 'Enter your email',
        placeHolder: '{"email"}',
    })
    .then ((email_input) => {
        context.globalState.update('email', email_input);
        const email_base = JSON.stringify(context.globalState.get('email'))
        console.log(email_base);
        if (email_base === undefined || email_base === '') {
            vscode.window.showErrorMessage('Please set your email and password in the settings.');
            
            return;
        }
        else if (!email_base.includes('@') ) {
            vscode.window.showErrorMessage('Please enter a valid email address.');
            return;
        }
        else {
            console.log("writing email")
            fetch('https://server-work-progress.vercel.app/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email_input })
            })
        }
    }
    )
    
}