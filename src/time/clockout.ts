import { time } from "console";
import { endTimer } from "./time_count";
import * as fs from "fs";
import * as vscode from "vscode";

export default function clockOut(context: vscode.ExtensionContext) {
    const start_time = parseInt(context.globalState.get("start_time") || "0");
    if (start_time === 0) {
        vscode.window.showErrorMessage("You have not clocked in yet!");
    }
    else {
        console.log("Clock out");
        const time_elapsed = JSON.stringify(endTimer(start_time));
        vscode.window.showInformationMessage(time_elapsed + " minutes you have worked today! \n \n Good job!" );
        context.globalState.update("start_time", "0");
    }
}