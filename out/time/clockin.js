"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clockIn;
const time_count_1 = require("./time_count");
function clockIn(context) {
    console.log("Clock in");
    const start_time = (0, time_count_1.startTimer)();
    context.globalState.update("start_time", start_time);
}
//# sourceMappingURL=clockin.js.map