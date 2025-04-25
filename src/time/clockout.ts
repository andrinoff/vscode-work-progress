import { time } from "console";
import { endTimer } from "./time_count";
import * as fs from "fs";
import * as vscode from "vscode";
import { getDayOfWeek, getCurrentDate } from "../email/weekly/date";
import sendEmail from "../email/weekly/send";

export default function clockOut(context: vscode.ExtensionContext) {
    const start_time = parseInt(context.globalState.get("start_time") || "0");
    if (start_time === 0) {
        vscode.window.showErrorMessage("You have not clocked in yet!");
    }
    else {
        console.log("Clock out");
        const time_elapsed = JSON.stringify(endTimer(start_time));
        vscode.window.showInformationMessage(time_elapsed + " minutes you have worked today! \n \n Good job!" );
        context.globalState.update("start_time", undefined);
        context.globalState.update("time_worked", time_elapsed);
        const dayOfWeek = getDayOfWeek();
        if (dayOfWeek === "Monday") {
            sendEmail(context);

            const prevLog = (context.globalState.get("monday_time") as string) || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("monday_time", newLog.toString());
            context.globalState.update("monday_date", getCurrentDate());
        }        else if (dayOfWeek === "Tuesday") {
            const prevLog = (context.globalState.get("tuesday_time") as string) || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("tuesday_time", newLog.toString());
            context.globalState.update("tuesday_date", getCurrentDate());
        }
        else if (dayOfWeek === "Wednesday") {
            const prevLog = (context.globalState.get("wednesday_time") as string) || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("wednesday_time", newLog.toString());
            context.globalState.update("wednesday_date", getCurrentDate());
        }
        else if (dayOfWeek === "Thursday") {
            const prevLog = (context.globalState.get("thursday_time") as string) || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("thursday_time", newLog.toString());
            context.globalState.update("thursday_date", getCurrentDate());
        }
        else if (dayOfWeek === "Friday") {
            const prevLog = (context.globalState.get("friday_time") as string) || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("friday_time", newLog.toString());
            context.globalState.update("friday_date", getCurrentDate());
        }
        else if (dayOfWeek === "Saturday") {
            const prevLog = (context.globalState.get("saturday_time") as string) || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("saturday_time", newLog.toString());
            context.globalState.update("saturday_date", getCurrentDate());
        }
        else if (dayOfWeek === "Sunday") {
            const prevLog = (context.globalState.get("sunday_time") as string) || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("sunday_time", newLog.toString());
            context.globalState.update("sunday_date", getCurrentDate());

    }
    
    }}