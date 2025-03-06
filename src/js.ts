import JSON5 from "json5";
import { ValtheraParser } from "./types";

class JsParser implements ValtheraParser {
    parse(query: string) {
        const match = query.match(/^(\w+)\((.*)\)$/);
        if (!match) throw new Error("Invalid query");

        const [, method, argsStr] = match;
        let args = this.parseArgs(argsStr);

        return { method, args };
    }

    private parseArgs(argsStr: string) {
        const args = [];
        let buffer = "";
        let bracketDepth = 0;

        for (let char of argsStr) {
            if (char === "{" || char === "[") bracketDepth++;
            if (char === "}" || char === "]") bracketDepth--;

            if (char === "," && bracketDepth === 0) {
                args.push(JSON5.parse(buffer.trim()));
                buffer = "";
            } else {
                buffer += char;
            }
        }

        if (buffer.trim()) args.push(JSON5.parse(buffer.trim()));

        return args;
    }
}

export default JsParser;