import * as vscode from "vscode";

// Note: if you want to add a error handler, please, remember, that 0...... is rounded to 0
// Note: works perfectly by the time of 08/05/25

export default function status(context: vscode.ExtensionContext) {
    console.log(context.globalState.get("time_worked"));
    const unRoundedTime = parseInt(context.globalState.get("time_worked") || "0") / 60;
    console.log("Unrounded time: " + unRoundedTime);
    const status = Math.round(unRoundedTime);
    console.log("Status: " + status);
    if (status < 1 && unRoundedTime > 0) {
        vscode.window.showInformationMessage("You have worked " + context.globalState.get("time_worked") + " seconds! Keep going!");
        return;
    } else {
        console.log("Status: " + status);
        vscode.window.showInformationMessage("You have worked " + status + " minutes! Keep going!");
    }

}


