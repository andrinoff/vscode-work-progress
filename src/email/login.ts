import * as vscode from 'vscode';

// Note: works perfectly by the time of 08/05/25
// This function is responsible for logging in the user by asking for their API key
// and storing it in the global state and VS Code configuration settings.

export default async function login(context: vscode.ExtensionContext): Promise<void> {
    const apiKey = await vscode.window.showInputBox({
        prompt: 'Enter your api key from the website',
        placeHolder: 'workp-',
    });

    if (!apiKey) {
        // User cancelled the input box
        // vscode.window.showInformationMessage('API key input cancelled.');
        return;
    }

    // Store the API key in global state for quick access within the extension
    await context.globalState.update('apiKey', apiKey);

    // Store the API key in VS Code configuration settings (global scope)
    await vscode.workspace.getConfiguration('work-progress').update('apiKey', apiKey, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('API Key saved.'); // Give feedback that it's saved
    // --- Get Email ---
// FIXME: TURNED OFF, QUOTA CAPPED
    // try {
    //     console.log(`Sending welcome email to: ${apiKey}`);
    //     const welcomeResponse = await fetch('https://server-work-progress.vercel.app/api/welcome', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ apiKey: apiKey }) // Correctly sending { "email": "user@example.com" }
    //     });

    //     console.log("Welcome email response status:", welcomeResponse.status);
    //     if (!welcomeResponse.ok) {
    //         const errorText = await welcomeResponse.text().catch(() => 'Could not read error body');
    //         vscode.window.showErrorMessage(`Failed to send welcome email. Server responded with ${welcomeResponse.status}: ${errorText}`);
    //         console.error("Error sending welcome email:", welcomeResponse.status, errorText);
    //     } else {
    //         // Optional: Inform user about the welcome email attempt
    //         // You could also potentially read the response body here if the welcome API returns useful info
    //         vscode.window.showInformationMessage(`Sent welcome email to you. Check spam!`);
    //     }

    // } catch (error: any) {
    //     // Handle network errors for the second fetch
    //     vscode.window.showErrorMessage(`Network error while sending welcome email: ${error.message || error}`);
    //     console.error("Network error sending welcome email:", error);
    // }
}

