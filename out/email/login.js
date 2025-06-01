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
// Note: works perfectly by the time of 08/05/25
// This function is responsible for logging in the user by asking for their API key
// and storing it in the global state and VS Code configuration settings.
async function login(context) {
    const apiKey = await vscode.window.showInputBox({
        prompt: 'Enter your api key from the website',
        placeHolder: 'workp-',
    });
    if (!apiKey) {
        // User cancelled the input box
        // vscode.window.showInformationMessage('API key input cancelled.');
        return;
    }
    // Store the API key in global state for quick access within the extension
    await context.globalState.update('apiKey', apiKey);
    // Store the API key in VS Code configuration settings (global scope)
    await vscode.workspace.getConfiguration('work-progress').update('apiKey', apiKey, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('API Key saved.'); // Give feedback that it's saved
    // --- Sending Welcoming Email ---
    try {
        console.log(`Sending welcome email to: ${apiKey}`);
        fetch('https://work-progress-backend.vercel.app/api/getConnected', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
            if (response.ok) {
                fetch('https://server-work-progress.vercel.app/api/welcome', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ apiKey: apiKey }) // Correctly sending { "email": "user@example.com" }
                })
                    .then(response => {
                    console.log("Welcome email response status:", response.status);
                    if (!response.ok) {
                        const errorText = response.text().catch(() => 'Could not read error body');
                        vscode.window.showErrorMessage(`Failed to send welcome email. Server responded with ${response.status}: ${errorText}`);
                        console.error("Error sending welcome email:", response.status, errorText);
                    }
                    else {
                        // Optional: Inform user about the welcome email attempt
                        // You could also potentially read the response body here if the welcome API returns useful info
                        vscode.window.showInformationMessage(`Sent welcome email to you. Check spam!`);
                    }
                });
            }
        });
    }
    catch (error) {
        // Handle network errors for the second fetch
        vscode.window.showErrorMessage(`Network error while sending welcome email: ${error.message || error}`);
        console.error("Network error sending welcome email:", error);
    }
}
//# sourceMappingURL=login.js.map