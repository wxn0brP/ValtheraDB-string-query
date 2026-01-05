export function parseReturn(method, args) {
    return { method, args };
}
export function parseSet(setString) {
    return Object.fromEntries(setString.split(/\s*,\s*/).map(pair => {
        const [key, value] = pair.split(/\s*=\s*/);
        let parsedValue = value;
        if (!isNaN(+value))
            parsedValue = +value;
        else
            parsedValue = removeQuotes(value);
        return [removeQuotes(key), parsedValue];
    }));
}
export function removeQuotes(str) {
    return str.replace(/^['"`]|['"`]$/g, "");
}
export function parseNum(str) {
    return isNaN(+str) ? str : +str;
}
//# sourceMappingURL=index.js.map