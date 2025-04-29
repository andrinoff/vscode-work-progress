import * as vscode from 'vscode';

export default async function login(context: vscode.ExtensionContext): Promise<void> {
    const apiKey = await vscode.window.showInputBox({
        prompt: 'Enter your api key from the website',
        placeHolder: 'workp-1234569787654567654',
    });

    if (!apiKey) {
        // User cancelled the input box
        // vscode.window.showInformationMessage('API key input cancelled.');
        return;
    }

    // Store the API key first
    await context.globalState.update('apiKey', apiKey);
    vscode.window.showInformationMessage('API Key saved.'); // Give feedback

    // --- Get Email ---

    try {
        console.log(`Sending welcome email to: ${apiKey}`); // This should now log the actual email
        const welcomeResponse = await fetch('https://server-work-progress.vercel.app/api/welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // *** Use the extracted emailString here ***
            body: JSON.stringify({ apiKey: apiKey }) // Correctly sending { "email": "user@example.com" }
        });

        console.log("Welcome email response status:", welcomeResponse.status);

        if (!welcomeResponse.ok) {
            const errorText = await welcomeResponse.text().catch(() => 'Could not read error body');
            vscode.window.showErrorMessage(`Failed to send welcome email. Server responded with ${welcomeResponse.status}: ${errorText}`);
            console.error("Error sending welcome email:", welcomeResponse.status, errorText);
        } else {
            // Optional: Inform user about the welcome email attempt
            // You could also potentially read the response body here if the welcome API returns useful info
            vscode.window.showInformationMessage(`Attempted to send welcome email to ${apiKey}.`);
        }

    } catch (error: any) {
        // Handle network errors for the second fetch
        vscode.window.showErrorMessage(`Network error while sending welcome email: ${error.message || error}`);
        console.error("Network error sending welcome email:", error);
    }
}
// Note: The above code assumes that the server will respond with a JSON object containing an "email" field.
// If the server's response format changes, you may need to adjust the parsing logic accordingly.
// Also, ensure that the server-side code is correctly handling the requests and sending appropriate responses.
// --- End of login function ---