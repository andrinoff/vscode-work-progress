"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTimer = startTimer;
exports.endTimer = endTimer;
function startTimer() {
    return Date.now();
}
function endTimer(start) {
    const time_elapsed = Date.now() - start;
    console.log("Time elapsed: " + time_elapsed);
    return Math.floor((time_elapsed / (1000 * 60)) % 60);
}
//# sourceMappingURL=time_count.js.map