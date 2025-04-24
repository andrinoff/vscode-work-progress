import * as vscode from 'vscode';

let sessionStartTime: number;
let interval: NodeJS.Timeout;

export default function checkScreenTime(context: vscode.ExtensionContext) {
    sessionStartTime = Date.now();
    interval = setInterval(() => {
        const now = Date.now();
        const minutes = Math.floor((now - sessionStartTime) / 1000 / 60);
        console.log(`[Your Extension] User has been working for ${minutes} minute(s).`);
        if (minutes > 60) {
            vscode.window.showInformationMessage("You have spent more than 60 minutes working. Take a break!");
            clearInterval(interval);
        }
        // You can also send telemetry or update a UI panel here
    }, 60 * 1000);

}