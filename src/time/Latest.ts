import * as vscode from 'vscode';

export default function updateLatest(apiKey: string, time: number) {
// Convert seconds into minutes
    var time_minutes = Math.round(time/60);
// Fetch data to the server

    fetch('https://work-progress-backend.vercel.app/api/getConnected', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            if(response.ok){
                fetch('https://work-progress-backend.vercel.app/api/updateLatest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ apiKey: apiKey, time: time_minutes })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Server responded with ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("Session end response:", data);
                        vscode.window.showInformationMessage(`Session ended. You worked for ${time_minutes} minutes.`);
                    })
                    .catch(error => {
                        console.error("Error sending session end data to backend:", error);
                        vscode.window.showErrorMessage(`Failed to send session end data: ${error.message}`);
                });
 }})
}
