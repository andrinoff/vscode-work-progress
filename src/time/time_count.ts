function startTimer() {
  return Date.now();
}
function endTimer(start: number) {
    const time_elapsed = Date.now() - start;
    console.log("Time elapsed: " + time_elapsed);
    return Math.floor((time_elapsed / (1000 * 60)) % 60);
    }





export {startTimer, endTimer};