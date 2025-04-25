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
let sessionStartTime;
let interval;
function checkScreenTime(context) {
    if (vscode.workspace.getConfiguration("work-progress.screenTimeReminder")) {
        sessionStartTime = Date.now();
        interval = setInterval(() => {
            const now = Date.now();
            const minutes = Math.floor((now - sessionStartTime) / 1000 / 60);
            const start_time = parseInt(context.globalState.get("start_time") || "0");
            const minutesWorked = Math.floor((now - start_time) / 1000 / 60);
            console.log(`[Your Extension] User has been working for ${minutes} minute(s).`);
            if (context.workspaceState.get("goal") && context.workspaceState.get("goal") || NaN < minutesWorked) {
                vscode.window.showInformationMessage(`You have reached your goal of ${context.globalState.get("goal")} minutes! Good job!`);
                context.globalState.update("goal", undefined);
                clearInterval(interval);
            }
            if (minutes > 60) {
                vscode.window.showInformationMessage("You have spent more than 60 minutes working. Take a break!");
                clearInterval(interval);
            }
            // You can also send telemetry or update a UI panel here
        }, 60 * 1000);
    }
    else {
        clearInterval(interval);
        return;
    }
}
//# sourceMappingURL=check_screen_time.js.map