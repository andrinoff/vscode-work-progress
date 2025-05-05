import * as vscode from 'vscode';
import sessionEnd from '../email/session_end';

// Variables to track focus state and time
let totalFocusedSeconds: number = 0;
let focusStartTime: number | null = null; // Timestamp when focus was gained, null if not focused
let focusIntervalId: NodeJS.Timeout | null = null; // Interval timer for tracking focus duration
let reminderShownThisSession: boolean = false; // Flag to prevent spamming the reminder
let totalIdleSeconds: number = 0; // Total idle time in seconds
let notFocusIntervalId: NodeJS.Timeout | null = null; // Interval timer for tracking idle time
let sessionEndIntervalId: NodeJS.Timeout | null = null; // Interval timer for session end

// --- Configuration ---
const CONFIG_SECTION = "work-progress";
const CONFIG_REMINDER_ENABLED = "screenTimeReminder";




function checkAndShowReminder() {
    const reminderEnabled = vscode.workspace.getConfiguration(CONFIG_SECTION).get<boolean>(CONFIG_REMINDER_ENABLED, true); // Default true
    const thresholdSeconds = 3600;
    const thresholdMinutes = thresholdSeconds / 60;

    if (reminderEnabled && totalFocusedSeconds >= thresholdSeconds && !reminderShownThisSession) {
        vscode.window.showInformationMessage(`You have spent more than ${thresholdMinutes} minutes working. Consider taking a break!`);
        reminderShownThisSession = true; // Show only once per continuous focus session exceeding the limit
    }
}

function startFocusTracking(context: vscode.ExtensionContext) {
    // If already tracking, do nothing
    if (focusIntervalId !== null) {
        return;
    }

    console.log("VS Code window focused. Starting timer.");
    focusStartTime = Date.now(); // Record start time
    if (notFocusIntervalId !== null) {
    clearInterval(notFocusIntervalId); // Clear idle interval if it exists
    notFocusIntervalId = null; // Reset idle interval ID
    }
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

function reminder() {
    const reminderEnabled = vscode.workspace.getConfiguration(CONFIG_SECTION).get<boolean>(CONFIG_REMINDER_ENABLED, true); // Default true
}


function stopFocusTracking(context: vscode.ExtensionContext) {
    // If not tracking, start another timer for idle time
    console.log("VS Code window already unfocused. Starting idle timer.");
    notFocusIntervalId = setInterval(() => {
        totalIdleSeconds++;
        // Save the current idle time in the global state
        context.globalState.update("time_idle", totalIdleSeconds);
        // Optional: Log idle time for debugging
        console.log(`Total idle time: ${totalIdleSeconds} seconds`);
        return;
    }, 1000); // Update every second

    console.log("VS Code window lost focus. Stopping timer.");
    if (focusIntervalId !== null) {
        clearInterval(focusIntervalId); // Stop the interval
        focusIntervalId = null; // Clear the interval ID
    }

    // Optional: Calculate the exact duration of the last focused session
    // This adds the final fraction of a second if needed, though usually the 1-second interval is sufficient.
    // if (focusStartTime) {
    //     const sessionMillis = Date.now() - focusStartTime;
    //     // Be careful here if you already incremented the last second via interval
    // }

    focusStartTime = null; // Reset start time
    reminderShownThisSession = false; // Reset reminder flag when focus is lost
}

export default function checkScreenTime(context: vscode.ExtensionContext) {
    console.log('Activating screen time tracker.');

    sessionEndIntervalId = setInterval(() => {
        const timeIdle = parseInt(context.globalState.get("time_idle", "0")) || 0;

        if (timeIdle >= 3600 && 
            context.globalState.get("time_worked") !== undefined && 
            context.globalState.get("time_worked") !== 0 && 
            vscode.workspace.getConfiguration("work-progress").get<boolean>("session", false)
        ) { // 1 hour in seconds
            // Send the time worked to the server
            

            sessionEnd(context, parseInt(context.globalState.get("time_worked") || "0") / 60);
            // clearing and resseting the global state
            context.globalState.update("time_worked", "0");
            if (focusIntervalId !== null) {
                clearInterval(focusIntervalId); // Stop the focus interval
                focusIntervalId = null; // Reset the interval ID
            }
            if (notFocusIntervalId !== null) {
                clearInterval(notFocusIntervalId); // Stop the idle interval
                notFocusIntervalId = null; // Reset the interval ID
            }
        }
    }, 1000); // Update every second

    // Register the window state change listener ONCE
    context.subscriptions.push(vscode.window.onDidChangeWindowState(windowState => {
        if (windowState.focused) {
            startFocusTracking(context);
        } else {
            stopFocusTracking(context);
        }
    }));

    // --- Initial Check ---
    // Check the initial state when the extension activates
    if (vscode.window.state.focused) {
        startFocusTracking(context);
    } else {
        // Ensure tracker is stopped if VS Code starts unfocused (might be redundant but safe)
        stopFocusTracking(context);
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