import { start } from "repl";
import {startTimer} from "./time_count";
import * as fs from "fs";
import * as vscode from "vscode";

export default function clockIn(context: vscode.ExtensionContext): void {
    console.log("Clock in");
    const start_time = startTimer();
    context.globalState.update("start_time", start_time);
}