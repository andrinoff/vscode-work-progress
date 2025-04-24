"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDate = getCurrentDate;
exports.getDayOfWeek = getDayOfWeek;
function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
}
function getDayOfWeek() {
    const date = new Date();
    const options = { weekday: 'long' };
    console.log(date.toLocaleDateString('en-US', options));
    return date.toLocaleDateString('en-US', options);
}
//# sourceMappingURL=date.js.map