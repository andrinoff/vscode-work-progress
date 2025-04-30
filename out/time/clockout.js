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
exports.default = clockOut;
const time_count_1 = require("./time_count");
const vscode = __importStar(require("vscode"));
function clockOut(context) {
    const start_time = parseInt(context.globalState.get("start_time") || "0");
    if (start_time === 0) {
        vscode.window.showErrorMessage("You have not clocked in yet!");
    }
    else {
        console.log("Clock out");
        const time_elapsed = JSON.stringify((0, time_count_1.endTimer)(start_time));
        vscode.window.showInformationMessage(time_elapsed + " minutes you have worked today! \n \n Good job!");
        context.globalState.update("start_time", undefined);
        context.globalState.update("time_worked", time_elapsed);
    }
}
//# sourceMappingURL=clockout.js.map