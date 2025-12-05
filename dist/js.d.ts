import { ValtheraParser } from "./types.js";
declare class JsParser implements ValtheraParser {
    parse(query: string): {
        method: string;
        args: any[];
    };
    private parseArgs;
}
export default JsParser;
