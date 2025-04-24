"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clockOut;
const time_count_1 = require("./time_count");
const vscode = __importStar(require("vscode"));
const date_1 = require("../email/weekly/date");
const send_1 = __importDefault(require("../email/weekly/send"));
function clockOut(context) {
    const start_time = parseInt(context.globalState.get("start_time") || "0");
    if (start_time === 0) {
        vscode.window.showErrorMessage("You have not clocked in yet!");
    }
    else {
        console.log("Clock out");
        const time_elapsed = JSON.stringify((0, time_count_1.endTimer)(start_time));
        vscode.window.showInformationMessage(time_elapsed + " minutes you have worked today! \n \n Good job!");
        context.globalState.update("start_time", "0");
        context.globalState.update("time_worked", time_elapsed);
        const dayOfWeek = (0, date_1.getDayOfWeek)();
        if (dayOfWeek === "Monday") {
            (0, send_1.default)(context);
            const prevLog = context.globalState.get("monday_time") || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("monday_time", newLog.toString());
            context.globalState.update("monday_date", (0, date_1.getCurrentDate)());
        }
        else if (dayOfWeek === "Tuesday") {
            const prevLog = context.globalState.get("tuesday_time") || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("tuesday_time", newLog.toString());
            context.globalState.update("tuesday_date", (0, date_1.getCurrentDate)());
        }
        else if (dayOfWeek === "Wednesday") {
            const prevLog = context.globalState.get("wednesday_time") || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("wednesday_time", newLog.toString());
            context.globalState.update("wednesday_date", (0, date_1.getCurrentDate)());
        }
        else if (dayOfWeek === "Thursday") {
            const prevLog = context.globalState.get("thursday_time") || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("thursday_time", newLog.toString());
            context.globalState.update("thursday_date", (0, date_1.getCurrentDate)());
        }
        else if (dayOfWeek === "Friday") {
            const prevLog = context.globalState.get("friday_time") || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("friday_time", newLog.toString());
            context.globalState.update("friday_date", (0, date_1.getCurrentDate)());
        }
        else if (dayOfWeek === "Saturday") {
            const prevLog = context.globalState.get("saturday_time") || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("saturday_time", newLog.toString());
            context.globalState.update("saturday_date", (0, date_1.getCurrentDate)());
        }
        else if (dayOfWeek === "Sunday") {
            const prevLog = context.globalState.get("sunday_time") || "0";
            const newLog = parseInt(prevLog) + parseInt(time_elapsed);
            context.globalState.update("sunday_time", newLog.toString());
            context.globalState.update("sunday_date", (0, date_1.getCurrentDate)());
        }
    }
}
//# sourceMappingURL=clockout.js.map