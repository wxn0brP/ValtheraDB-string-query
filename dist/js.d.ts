import { ValtheraParser } from "./types.js";
declare class ValtheraJsParser implements ValtheraParser {
    parse(query: string): {
        method: string;
        args: any[];
    };
    private parseArgs;
}
declare const valtheraJsParser: ValtheraJsParser;
export default valtheraJsParser;
