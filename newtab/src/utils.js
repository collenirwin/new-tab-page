const encodingTable = [
    [';', '&semi;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['/', '&#47;'],
    ['"', '&quot;'],
    ["'", '&#39;'],
    ['|', '&#124;'],
    ['*', '&ast;'],
    [' ', '&nbsp;']
];

/**
 * HTML-encodes the given text (ex: '<' becomes '&lt;')
 * @param {String} text 
 */
export const htmlEncode = (text) => {
    for (let x = 0; x < encodingTable.length; x++) {
        // replace all occurrences of 'escapable' chars with their escaped equivalent
        text = text.split(encodingTable[x][0]).join(encodingTable[x][1]);
    }

    return text;
};