export function getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
}
export function getDayOfWeek(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    console.log(date.toLocaleDateString('en-US', options));
    return date.toLocaleDateString('en-US', options);
}
