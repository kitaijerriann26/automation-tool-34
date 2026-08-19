/**
 * A utility function to format a date.
 *
 * @param {Date} date - The date object to format.
 * @param {string} format - The desired format of the date string.
 * @returns {string} - The formatted date string.
 */
function formatDate(date: Date, format: string): string {
    const options: Intl.DateTimeFormatOptions = {};

    switch (format) {
        case 'short':
            options.year = 'numeric';
            options.month = '2-digit';
            options.day = '2-digit';
            break;
        case 'long':
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
            break;
        default:
            throw new Error('Invalid format specified.');
    }
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * A utility function to debounce a function call.
 *
 * @param {Function} fn - The function to be debounced.
 * @param {number} delay - The amount of delay in milliseconds.
 * @returns {Function} - A debounced version of the provided function.
 */
function debounce(fn: Function, delay: number): Function {
    let timeoutId: NodeJS.Timeout;
    return function (...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

export { formatDate, debounce };