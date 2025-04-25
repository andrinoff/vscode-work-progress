import { clear } from 'console';
import * as vscode from 'vscode';

let sessionStartTime: number;
let interval: NodeJS.Timeout;

export default function checkScreenTime(context: vscode.ExtensionContext) {
    if (vscode.workspace.getConfiguration("work-progress.screenTimeReminder")){    
        sessionStartTime = Date.now();
        interval = setInterval(() => {
            const now = Date.now();
            const minutes = Math.floor((now - sessionStartTime) / 1000 / 60);
            const start_time = parseInt(context.globalState.get("start_time") || "0");
            const minutesWorked = Math.floor((now - start_time) / 1000 / 60);
            console.log(`[Your Extension] User has been working for ${minutes} minute(s).`);
            if(context.workspaceState.get("goal") && context.workspaceState.get<number>("goal") || NaN < minutesWorked){
                vscode.window.showInformationMessage(`You have reached your goal of ${context.globalState.get("goal")} minutes! Good job!`);
                context.globalState.update("goal", undefined);
                clearInterval(interval);
            }
            if (minutes > 60) {
                vscode.window.showInformationMessage("You have spent more than 60 minutes working. Take a break!");
                clearInterval(interval);
            }
            // You can also send telemetry or update a UI panel here
        }, 60 * 1000);}
        else {
            clearInterval(interval);
            return;
        }

}