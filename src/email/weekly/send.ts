import * as vscode from 'vscode';

export default function sendEmail(context: vscode.ExtensionContext): void {
    const email = context.globalState.get<string>('userEmail') || 'default@example.com';

    const data = {
        email : context.globalState.get<string>('email'),
        date_monday: context.globalState.get<string>('monday_date'),
        time_monday: context.globalState.get<string>('monday_time'),
        date_tuesday: context.globalState.get<string>('tuesday_date'),
        time_tuesday: context.globalState.get<string>('tuesday_time'),
        date_wednesday: context.globalState.get<string>('wednesday_date'),
        time_wednesday: context.globalState.get<string>('wednesday_time'),
        date_thursday: context.globalState.get<string>('thursday_date'),
        time_thursday: context.globalState.get<string>('thursday_time'),
        date_friday: context.globalState.get<string>('friday_date'),
        time_friday: context.globalState.get<string>('friday_time'),
        date_saturday: context.globalState.get<string>('saturday_date'),
        time_saturday: context.globalState.get<string>('saturday_time'),
        date_sunday: context.globalState.get<string>('sunday_date'),
        time_sunday: context.globalState.get<string>('sunday_time')
    };

    fetch('http://localhost:3000/send-weekly', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        vscode.window.showInformationMessage('Email sent successfully.');
        console.log(result);
    })
    .catch(error => {
        vscode.window.showErrorMessage('Failed to send email.');
        console.error(error);
    });};