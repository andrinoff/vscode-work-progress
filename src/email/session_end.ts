import * as vscode from 'vscode';

// FIXME: err 404 sometimes

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
    // Get the current date of the week to save it in the backend
    const weekdays = [ "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const date = new Date();
    const day = weekdays[date.getDay()];



    // TURNED OFF, QUOTA CAPPED
    // FIXME: May 22
    // TODO: Get domain xD
    // fetch('https://server-work-progress.vercel.app/api/session_end', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ apiKey: apiKey, time_worked: time_worked })
    // })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error(`Server responded with ${response.status}`);
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         console.log("Session end response:", data);
    //         vscode.window.showInformationMessage(`Session ended. You worked for ${time_worked} seconds.`);
    //     })
    //     .catch(error => {
    //         console.error("Error sending session end data:", error);
    //         vscode.window.showErrorMessage(`Failed to send session end data: ${error.message}`);
    //     });



    fetch('https://work-progress-backend.vercel.app/api/updateWeekTime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey, dayTime: time_worked, day: day })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Session end response:", data);
            vscode.window.showInformationMessage(`Session ended. You worked for ${time_worked/60} minutes.`);
        })
        .catch(error => {
            console.error("Error sending session end data to backend:", error);
            vscode.window.showErrorMessage(`Failed to send session end data: ${error.message}`);
    });
}


    