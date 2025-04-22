import { endTimer } from "./time_count";
import * as vscode from "vscode";

export default function status(context: vscode.ExtensionContext) {
    const start_time = parseInt(context.globalState.get("start_time") || "0");
    const status = endTimer(start_time);
    if (start_time === 0) {
        vscode.window.showInformationMessage("You have not clocked in yet!");
    }
    else {
        vscode.window.showInformationMessage("You have worked " + status + " minutes! Keep going!");
    }
}