import JSON5 from "json5";
class JsParser {
    parse(query) {
        const match = query.match(/^(\w+)\((.*)\)$/);
        if (!match)
            throw new Error("Invalid query");
        const [, method, argsStr] = match;
        let args = this.parseArgs(argsStr);
        return { method, args };
    }
    parseArgs(argsStr) {
        const args = [];
        let buffer = "";
        let bracketDepth = 0;
        for (let char of argsStr) {
            if (char === "{" || char === "[")
                bracketDepth++;
            if (char === "}" || char === "]")
                bracketDepth--;
            if (char === "," && bracketDepth === 0) {
                args.push(JSON5.parse(buffer.trim()));
                buffer = "";
            }
            else {
                buffer += char;
            }
        }
        if (buffer.trim())
            args.push(JSON5.parse(buffer.trim()));
        return args;
    }
}
export default JsParser;
//# sourceMappingURL=js.js.map