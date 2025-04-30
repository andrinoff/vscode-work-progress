
import * as vscode from "vscode";

export default function status(context: vscode.ExtensionContext) {
    const status = parseInt(context.globalState.get("time_worked") || "0");
    if (status === 0) {
        vscode.window.showInformationMessage("error occured");
    }
    else {
        vscode.window.showInformationMessage("You have worked " + status + " minutes! Keep going!");
    }
}

