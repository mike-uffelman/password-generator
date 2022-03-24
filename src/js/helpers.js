


// convert html entity characters to symbol
export const htmlEntityRefToChar = function(str) {
    return str.replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#92;', '\\')
};

// convert symbol to html entity characters
export const charToHtmlEntityRef = function(str) {
    return str.replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('\\', '&#92;')
};

// apply background flicker to password item actions (check, copy)
export const flicker = function(item, type) {
    item.classList.toggle(type)
    setTimeout(() => item.classList.toggle(type), 1000);
}