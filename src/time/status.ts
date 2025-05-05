
import * as vscode from "vscode";

export default function status(context: vscode.ExtensionContext) {
    const status = parseInt(context.globalState.get("time_worked") || "0") / 60;
    if (status === 0) {
        vscode.window.showInformationMessage("error occured");
    }
    else {
        console.log("Status: " + status);
        vscode.window.showInformationMessage("You have worked " + status + " minutes! Keep going!");
    }
}

