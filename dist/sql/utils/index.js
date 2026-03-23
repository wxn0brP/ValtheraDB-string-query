export function parseReturn(method, collection = "", query = {}) {
    if (collection)
        query.collection = collection;
    return { method, query };
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