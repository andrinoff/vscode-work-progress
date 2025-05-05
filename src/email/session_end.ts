import * as vscode from 'vscode';

// This function is called when the user ends their session
// It sends the time worked to the server
// and sends to email
export default function sessionEnd(context: vscode.ExtensionContext, time_worked: number) {
    // Get the API key from the global state
    const apiKey = context.globalState.get("apiKey");
    console.log("Session end API key:", apiKey); // Log the API key for debugging
    console.log("sending email with time worked:", time_worked); // Log the time worked for debugging
    if (!apiKey) {
        vscode.window.showErrorMessage("API key not found. Please log in first.");
        return;
    }

    // Send the time worked to the server
    fetch('https://server-work-progress.vercel.app/api/session_end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey, time_worked: time_worked })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Session end response:", data);
            vscode.window.showInformationMessage(`Session ended. You worked for ${time_worked} seconds.`);
        })
        .catch(error => {
            console.error("Error sending session end data:", error);
            vscode.window.showErrorMessage(`Failed to send session end data: ${error.message}`);
        });
    // Save the latest session time to the backend
    fetch('https://work-progress-backend.vercel.app/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey, latestTime: time_worked, sign : "updateLatestTime" })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Session end response:", data);
            vscode.window.showInformationMessage(`Session ended. You worked for ${time_worked} seconds.`);
        })
        .catch(error => {
            console.error("Error sending session end data:", error);
            vscode.window.showErrorMessage(`Failed to send session end data: ${error.message}`);
    });
}