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

    let emailString: string | undefined;

    // --- Get Email ---
    try {
        console.log("Fetching email for API key...");
        const emailResponse = await fetch("https://work-progress-backend.vercel.app/api/server", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // If the server *requires* knowing you accept JSON, add this:
                "Accept": "application/json"
            },
            body: JSON.stringify({
                apiKey: apiKey,
                sign: "getEmail"
            })
        });

        console.log("Email fetch response status:", emailResponse.status);

        if (!emailResponse.ok) {
            // Handle HTTP errors (like 401, 403, 404, 500)
            const errorText = await emailResponse.text().catch(() => 'Could not read error body'); // Try to get error details
            vscode.window.showErrorMessage(`Failed to get email. Server responded with ${emailResponse.status}: ${errorText}`);
            console.error("Error fetching email:", emailResponse.status, errorText);
            return; // Stop execution if email fetch fails
        }

        // *** Read the response body as JSON and extract the email property ***
        try {
            // Parse the JSON response
            // Assuming the response looks like: { "email": "user@example.com" }
            const emailData = await emailResponse.json() as { email: string };

            // Extract the email value
            emailString = emailData.email;
            console.log("Extracted email string from JSON:", emailString);

            if (!emailString) {
                 vscode.window.showErrorMessage('Received JSON, but the email field was missing or empty.');
                 console.error("Received JSON object without 'email' field or with empty value:", emailData);
                 return;
            }

            // Optional: Basic email format validation (now checking the actual email)
            if (!emailString.includes('@')) {
                vscode.window.showWarningMessage(`Received potentially invalid email format: ${emailString}`);
                // Decide if you want to proceed or return here based on your requirements
            }

        } catch (jsonError: any) {
            // Handle cases where the response body isn't valid JSON
            vscode.window.showErrorMessage(`Failed to parse email response as JSON: ${jsonError.message || jsonError}`);
            console.error("JSON parsing error:", jsonError);
            // Attempt to log raw text for debugging if JSON parsing fails
            try {
                const rawText = await emailResponse.text();
                console.error("Raw response text that failed JSON parsing:", rawText);
            } catch (textError) {
                console.error("Could not read raw text after JSON parsing failed.");
            }
            return;
        }

    } catch (error: any) {
        // Handle network errors (fetch couldn't reach the server, DNS issues, etc.)
        vscode.window.showErrorMessage(`Network error while fetching email: ${error.message || error}`);
        console.error("Network error fetching email:", error);
        return; // Stop execution on network error
    }


    // --- Send Welcome Email ---
    // Ensure emailString was successfully retrieved before proceeding
    if (!emailString) {
        // This check is slightly redundant due to checks above, but good for safety
        console.error("Cannot send welcome email because emailString is missing or invalid.");
        vscode.window.showErrorMessage("Could not proceed: Email address was not obtained.");
        return;
    }

    try {
        console.log(`Sending welcome email to: ${emailString}`); // This should now log the actual email
        const welcomeResponse = await fetch('https://server-work-progress.vercel.app/api/welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // *** Use the extracted emailString here ***
            body: JSON.stringify({ email: emailString }) // Correctly sending { "email": "user@example.com" }
        });

        console.log("Welcome email response status:", welcomeResponse.status);

        if (!welcomeResponse.ok) {
            const errorText = await welcomeResponse.text().catch(() => 'Could not read error body');
            vscode.window.showErrorMessage(`Failed to send welcome email. Server responded with ${welcomeResponse.status}: ${errorText}`);
            console.error("Error sending welcome email:", welcomeResponse.status, errorText);
        } else {
            // Optional: Inform user about the welcome email attempt
            // You could also potentially read the response body here if the welcome API returns useful info
            vscode.window.showInformationMessage(`Attempted to send welcome email to ${emailString}.`);
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