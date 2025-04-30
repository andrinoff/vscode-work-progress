import * as vscode from 'vscode';

export default function setGoal(context: vscode.ExtensionContext): void {
    vscode.window.showInputBox({
        prompt: 'Enter your goal in minutes',
        placeHolder: 'e.g. 59',
    }).then(goalInput => {
        if (goalInput) {
            let start:number = 0;
            try {
                const goal = parseInt(goalInput);

                const interval = setInterval(() => {
                    start++;
                    if (start/60 >= goal) {
                        clearInterval(interval);
                        vscode.window.showInformationMessage(`Congratulations! You have reached your goal of ${goal} minutes!`);
                    }
            }, 1000);
            } catch(error){
                vscode.window.showErrorMessage('Please enter a valid number.');
                console.error("Error setting goal: ", error);
            }
            
        } else {
            vscode.window.showWarningMessage('No goal was set.');
        }
    });
}
