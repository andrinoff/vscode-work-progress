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
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const clockin_1 = __importDefault(require("./time/clockin"));
const clockout_1 = __importDefault(require("./time/clockout"));
// This method is called when extension is activated
// extension is activated the very first time the command is executed
function activate(context) {
    // This log helps with cathing errors at the startup
    console.log('Congratulations, your extension "work-progress" is now active!');
    const login = "work-progress.login";
    const login_command = async (name = "Login to Work Progress") => {
        const result = await vscode.window.showInputBox({
            placeHolder: 'Enter your login:',
        });
        console.log(result);
    };
    const disposable = vscode.commands.registerCommand('work-progress.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Work Progress has been loaded correctly!');
    });
    context.subscriptions.push(disposable, vscode.commands.registerCommand(login, login_command), vscode.commands.registerCommand('work-progress.clockIn', () => (0, clockin_1.default)(context)), vscode.commands.registerCommand('work-progress.clockOut', () => (0, clockout_1.default)(context)));
}
// This method is called when your extension is deactivated
function deactivate() {
    // This log helps with cathing errors at the shutdown
    console.log('Work Progress has been deactivated!');
}
//# sourceMappingURL=extension.js.map