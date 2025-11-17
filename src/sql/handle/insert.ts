import { parseReturn } from "#sql/utils";

export function handleInsert(query: string) {
    const match = query.match(/INSERT INTO ([\w\/]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    if (!match) throw new Error("Invalid INSERT syntax");
    const collection = match[1];
    const keys = match[2].split(/\s*,\s*/);

    function splitByCommasOutsideQuotes(str: string): string[] {
        const tokens: string[] = [];
        let current = '';
        let inSingleQuote = false;
        let inDoubleQuote = false;

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if ((char === "'") && !inDoubleQuote) {
                inSingleQuote = !inSingleQuote;
                current += char;
            } else if (char === '"' && !inSingleQuote) {
                inDoubleQuote = !inDoubleQuote;
                current += char;
            } else if (char === ',' && !inSingleQuote && !inDoubleQuote) {
                tokens.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        tokens.push(current);
        return tokens;
    }

    const rawValues = splitByCommasOutsideQuotes(match[3]);
    const values = rawValues.map(v => {
        v = v.trim();
        if (v.length >= 2) {
            if (v[0] === "'" && v[v.length - 1] === "'") {
                v = v.substring(1, v.length - 1);
            } else if (v[0] === '"' && v[v.length - 1] === '"') {
                v = v.substring(1, v.length - 1);
            }
        }
        return v;
    });

    if (keys.length !== values.length) throw new Error("Number of columns and values does not match");
    const data = Object.fromEntries(keys.map((k, i) => [k, isNaN(values[i] as any) ? values[i] : Number(values[i])]));
    return parseReturn("add", [collection, data]);
}