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
exports.default = login;
const vscode = __importStar(require("vscode"));
const nodejs_1 = __importDefault(require("@emailjs/nodejs"));
function login(context) {
    const email_input = vscode.window.showInputBox({
        prompt: 'Enter your email',
        placeHolder: '{"email"}',
    })
        .then((email_input) => {
        context.globalState.update('email', email_input);
        const email_base = JSON.stringify(context.globalState.get('email'));
        console.log(email_base);
        if (email_base === undefined || email_base === '') {
            vscode.window.showErrorMessage('Please set your email and password in the settings.');
            return;
        }
        else if (!email_base.includes('@')) {
            vscode.window.showErrorMessage('Please enter a valid email address.');
            return;
        }
        else {
            console.log("writing email");
            nodejs_1.default.send("service_6p3ieyw", "template_bi3l5ac", {
                email: email_input,
            }, {
                publicKey: "wIG8oL0UVStt5BkgM",
                privateKey: "-BEngVWtZxIv2xDtAPTmx"
            })
                .then((response) => console.log('SUCCESS!', response.status, response.text))
                .catch((err) => console.log('FAILED...', err));
        }
    });
}
//# sourceMappingURL=login.js.map