
import * as vscode from "vscode";
// FIXME: the status function is either multiplying or dividing the time worked by 2 in beta it's saying "error occured"
export default function status(context: vscode.ExtensionContext) {
    const status = Math.round(parseInt(context.globalState.get
        ("time_worked") || "0") / 60);
    console.log("Status: " + status);
    if (status === 0) {
        vscode.window.showInformationMessage("error occured");
    }
    else {
        console.log("Status: " + status);
        vscode.window.showInformationMessage("You have worked " + status + " minutes! Keep going!");
    }
}

