export const COLLECTION_SRC = '`[^`]+`|"[^"]+"|[\\w/]+';
const FIELD_PART_SRC = '`[^`]+`|"[^"]+"|[\\w/]+';
export const FIELD_SRC = `(?:${FIELD_PART_SRC})(?:\\.(?:${FIELD_PART_SRC}))*`;
export function parseReturn(method, collection = "", query = {}) {
    if (collection)
        query.collection = collection;
    return {
        method,
        query,
    };
}
export function parseSet(setString) {
    return Object.fromEntries(setString.split(/\s*,\s*/).map(pair => {
        const [key, value] = pair.split(/\s*=\s*/);
        let parsedValue = value;
        if (!Number.isNaN(+value))
            parsedValue = +value;
        else
            parsedValue = removeQuotes(value);
        return [
            removeQuotes(key),
            parsedValue,
        ];
    }));
}
export function removeQuotes(str) {
    return str.replace(/^['"`]|['"`]$/g, "");
}
/** Strip surrounding identifier quotes (backticks or double quotes). */
export function stripIdentQuotes(str) {
    const trimmed = str.trim();
    if ((trimmed.startsWith("`") && trimmed.endsWith("`")) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"')))
        return trimmed.slice(1, -1);
    return trimmed;
}
/** Split on a single-char separator, ignoring separators inside quotes. */
export function splitOutsideQuotes(input, separator) {
    const parts = [];
    let current = "";
    let quote;
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (quote) {
            current += char;
            if (char === quote && input[i - 1] !== "\\")
                quote = undefined;
        }
        else if (char === "`" || char === '"' || char === "'") {
            quote = char;
            current += char;
        }
        else if (char === separator) {
            parts.push(current.trim());
            current = "";
        }
        else {
            current += char;
        }
    }
    parts.push(current.trim());
    return parts;
}
/** Last field in a path: `users`.`id` -> id */
export function lastPathPart(value) {
    const parts = splitOutsideQuotes(value.trim(), ".");
    return stripIdentQuotes(parts[parts.length - 1]);
}
/** Field path without the document/collection qualifier: `users`.`id` -> id */
export function normalizeFieldPath(value, collection) {
    const parts = splitOutsideQuotes(value.trim(), ".").map(stripIdentQuotes);
    if (collection &&
        parts.length > 1 &&
        parts[0] === collection &&
        parts[1] !== "*")
        parts.shift();
    return parts.join(".");
}
export function parseNum(str) {
    return Number.isNaN(+str) ? str : +str;
}
//# sourceMappingURL=index.js.map