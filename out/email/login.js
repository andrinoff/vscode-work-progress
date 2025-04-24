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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = login;
const vscode = __importStar(require("vscode"));
async function login(context) {
    const email_input = await vscode.window.showInputBox({
        prompt: 'Enter your email',
        placeHolder: 'name@example.com',
    });
    if (!email_input || email_input.trim() === '') {
        vscode.window.showErrorMessage('Please set your email and password in the settings.');
        return;
    }
    if (!email_input.includes('@')) {
        vscode.window.showErrorMessage('Please enter a valid email address.');
        return;
    }
    context.globalState.update('email', email_input);
    console.log("writing email");
    try {
        const response = await fetch('https://server-work-progress.vercel.app/api/welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email_input })
        });
        console.log(response);
        vscode.window.showInformationMessage('Email sent successfully!');
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to send email: ${error}`);
    }
}
//# sourceMappingURL=login.js.map