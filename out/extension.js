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
exports.activate = activate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const status_1 = __importDefault(require("./time/status"));
const login_1 = __importDefault(require("./email/login"));
const check_screen_time_1 = __importDefault(require("./screentime/check_screen_time"));
const setGoal_1 = __importDefault(require("./time/setGoal"));
const Latest_1 = __importDefault(require("./time/Latest"));
let updateBackendIntervalId = null;
// This method is called when extension is activated
// extension is activated the very first time the command is executed
function activate(context) {
    //  Updating the settings
    if (vscode.workspace.getConfiguration("work-progress").get("apiKey") !== context.globalState.get("apiKey")) {
        context.globalState.update("apiKey", vscode.workspace.getConfiguration("work-progress").get("apiKey"));
    }
    // Checking if the user is logged in
    if (vscode.workspace.getConfiguration("work-progress").get("apiKey") === undefined || vscode.workspace.getConfiguration("work-progress").get("apiKey") === "" || context.globalState.get("apiKey") === undefined || context.globalState.get("apiKey") === "") {
        vscode.window.showInformationMessage("Please log in to Work Progress to use email notifications. ", "Log in", "API key").then((selection) => {
            if (selection === "Log in") {
                vscode.env.openExternal(vscode.Uri.parse("https://andrinoff.github.io/workprogress/account/signin.html"));
            }
            else if (selection === "API key") {
                (0, login_1.default)(context);
            }
        });
    }
    // This log helps with cathing errors at the startup
    console.log('Congratulations, your extension "work-progress" is now active!');
    // Send the email with the time worked
    (0, check_screen_time_1.default)(context);
    updateBackendIntervalId = setInterval(() => {
        const apiKey = context.globalState.get("apiKey");
        const timeWorked = parseInt(context.globalState.get("time_worked") || "0") || 0;
        if (timeWorked != 0) {
            (0, Latest_1.default)(JSON.stringify(apiKey), timeWorked);
        }
        // Send the time worked to the server every minute
    }, 60000);
    const disposable = vscode.commands.registerCommand('work-progress.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Work Progress has been loaded correctly!');
    });
    context.subscriptions.push(disposable, vscode.commands.registerCommand('work-progress.setGoal', () => (0, setGoal_1.default)(context)), vscode.commands.registerCommand("work-progress.login", () => (0, login_1.default)(context)), vscode.commands.registerCommand('work-progress.status', () => (0, status_1.default)(context)));
}
//# sourceMappingURL=extension.js.map