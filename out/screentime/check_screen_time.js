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
exports.default = checkScreenTime;
const vscode = __importStar(require("vscode"));
// Variables to track focus state and time
let totalFocusedSeconds = 0;
let focusStartTime = null; // Timestamp when focus was gained, null if not focused
let focusIntervalId = null; // Interval timer for tracking focus duration
let reminderShownThisSession = false; // Flag to prevent spamming the reminder
// --- Configuration ---
const CONFIG_SECTION = "work-progress";
const CONFIG_REMINDER_ENABLED = "screenTimeReminder";
function getReminderThresholdSeconds() {
    const minutes = 60; // Default 60 minutes
    return minutes;
}
function checkAndShowReminder() {
    const reminderEnabled = vscode.workspace.getConfiguration(CONFIG_SECTION).get(CONFIG_REMINDER_ENABLED, true); // Default true
    const thresholdSeconds = getReminderThresholdSeconds();
    const thresholdMinutes = thresholdSeconds / 60;
    if (reminderEnabled && totalFocusedSeconds >= thresholdSeconds && !reminderShownThisSession) {
        vscode.window.showInformationMessage(`You have spent more than ${thresholdMinutes} minutes working. Consider taking a break!`);
        reminderShownThisSession = true; // Show only once per continuous focus session exceeding the limit
    }
}
function startFocusTracking(context) {
    // If already tracking, do nothing
    if (focusIntervalId !== null) {
        return;
    }
    console.log("VS Code window focused. Starting timer.");
    focusStartTime = Date.now(); // Record start time
    // Start an interval to increment the focused time every second
    focusIntervalId = setInterval(() => {
        totalFocusedSeconds++;
        // Save tbe current time working in the global state
        context.globalState.update("time_worked", totalFocusedSeconds);
        // Optional: Log cumulative time for debugging
        console.log(`Total focused time: ${totalFocusedSeconds} seconds`);
        // Check if the reminder threshold has been reached
        checkAndShowReminder();
    }, 1000); // Update every second
}
function stopFocusTracking() {
    // If not tracking, do nothing
    if (focusIntervalId === null) {
        return;
    }
    console.log("VS Code window lost focus. Stopping timer.");
    clearInterval(focusIntervalId); // Stop the interval
    focusIntervalId = null; // Clear the interval ID
    // Optional: Calculate the exact duration of the last focused session
    // This adds the final fraction of a second if needed, though usually the 1-second interval is sufficient.
    // if (focusStartTime) {
    //     const sessionMillis = Date.now() - focusStartTime;
    //     // Be careful here if you already incremented the last second via interval
    // }
    focusStartTime = null; // Reset start time
    reminderShownThisSession = false; // Reset reminder flag when focus is lost
}
function checkScreenTime(context) {
    console.log('Activating screen time tracker.');
    // Register the window state change listener ONCE
    context.subscriptions.push(vscode.window.onDidChangeWindowState(windowState => {
        if (windowState.focused) {
            startFocusTracking(context);
        }
        else {
            stopFocusTracking();
        }
    }));
    // --- Initial Check ---
    // Check the initial state when the extension activates
    if (vscode.window.state.focused) {
        startFocusTracking(context);
    }
    else {
        // Ensure tracker is stopped if VS Code starts unfocused (might be redundant but safe)
        stopFocusTracking();
    }
    // --- Cleanup ---
    // Ensure the interval is cleared when the extension deactivates
    context.subscriptions.push({
        dispose: () => {
            console.log('Work Progress has been deactivated! session ended. with time worked: ' + context.globalState.get("time_worked"));
            // console.log('Deactivating screen time tracker. Clearing interval.');
            // Send the time worked to the server
            if (focusIntervalId !== null) {
                clearInterval(focusIntervalId);
                focusIntervalId = null;
            }
        }
    });
}
//# sourceMappingURL=check_screen_time.js.map