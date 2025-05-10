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
        reminderShownThisSession = true; // Show only once per continuous focus session exceeding the limit.
    }
}

function startFocusTracking(context: vscode.ExtensionContext) {
    console.log("VS Code window focused. Stopping idle timer, starting focus timer.");

    // Stop the idle timer first
    if (notFocusIntervalId !== null) {
        clearInterval(notFocusIntervalId); // Clear idle interval if it exists
        notFocusIntervalId = null; // Reset idle interval ID
    }
    context.globalState.update("time_idle", "0");
    totalIdleSeconds = 0; // Reset idle time counter

    // Ensure any existing focus timer is stopped before starting a new one
    if (focusIntervalId !== null) { clearInterval(focusIntervalId); }
    focusStartTime = Date.now(); // Record start time
    // Start an interval to increment the focused time every second
    focusIntervalId = setInterval(() => {
        totalFocusedSeconds++;
        // Save the current time working in the global state
        context.globalState.update("time_worked", totalFocusedSeconds);
        // Optional: Log cumulative time for debugging
        console.log(`Total focused time: ${context.globalState.get("time_worked")} seconds`);

        // Check if the reminder threshold has been reached
        checkAndShowReminder();

    }, 1000); // Update every second
}

function stopFocusTracking(context: vscode.ExtensionContext) {
    console.log("VS Code window lost focus. Stopping focus timer, starting idle timer.");

    // Stop the focus timer first
    if (focusIntervalId !== null) {
        clearInterval(focusIntervalId); // Stop the interval
        focusIntervalId = null; // Clear the interval ID
    }
    focusStartTime = null; // Reset start time
    reminderShownThisSession = false; // Reset reminder flag when focus is lost

    // Ensure any existing idle timer is stopped before starting a new one
    if (notFocusIntervalId !== null) { clearInterval(notFocusIntervalId); }
    // Start the idle timer
    notFocusIntervalId = setInterval(() => {
        totalIdleSeconds++;
        // Save the current idle time in the global state
        context.globalState.update("time_idle", totalIdleSeconds);
        // Optional: Log idle time for debugging
        console.log(`Total idle time: ${totalIdleSeconds} seconds`);
    // if (focusStartTime) {
    //     const sessionMillis = Date.now() - focusStartTime;
    //     // Be careful here if you already incremented the last second via interval
    // }

    focusStartTime = null; // Reset start time
}, 1000); // Update every second
}
export default function checkScreenTime(context: vscode.ExtensionContext) {
    console.log('Activating screen time tracker.');

    sessionEndIntervalId = setInterval(() => {
        const timeIdle = parseInt(context.globalState.get("time_idle") || "0") || 0;
        const sessionEnabled = vscode.workspace.getConfiguration("work-progress").get<boolean>("session", false);

        if (sessionEnabled && timeIdle >= 3600) { // 1 hour in seconds
            console.log("Session ended due to idle time threshold.");
            // Send the time worked to the server
            const minutesWorked =Math.round( parseInt(context.globalState.get("time_worked") || "0") / 60);
            sessionEnd(context, minutesWorked);

            // Reset counters and global state for the new "session"
            totalFocusedSeconds = 0;
            totalIdleSeconds = 0;
            context.globalState.update("time_worked", "0");
            context.globalState.update("time_idle", "0");
            reminderShownThisSession = false; // Also reset reminder flag

            // NOTE: We no longer clear focusIntervalId or notFocusIntervalId here.
            // The currently active interval (based on focus state) will continue, but operate on the reset counters.
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
            // Note: Here we cannot put the sessionEnd function, because dispose is not async
            // and the sessionEnd function is going to be forced to stop before the fetch is done
            // So we need to put the sessionEnd function in the setInterval in extension.ts

            // Reset all timers and flags
            totalFocusedSeconds = 0;
            totalIdleSeconds = 0;
            // console.log('Deactivating screen time tracker. Clearing interval.');

            if (focusIntervalId !== null) {
                clearInterval(focusIntervalId);
                focusIntervalId = null;
            }
            if (notFocusIntervalId !== null) {
                clearInterval(notFocusIntervalId);
                notFocusIntervalId = null;
            }
        }
    });}