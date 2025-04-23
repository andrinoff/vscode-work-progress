"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clockIn;
const time_count_1 = require("./time_count");
const check_screen_time_1 = __importDefault(require("../screentime/check_screen_time"));
function clockIn(context) {
    console.log("Clock in");
    const start_time = (0, time_count_1.startTimer)();
    context.globalState.update("start_time", start_time);
    (0, check_screen_time_1.default)(context);
}
//# sourceMappingURL=clockin.js.map