import { Opts, ValtheraParser } from "../types.js";
declare class SQLParser implements ValtheraParser {
    parse(query: string, opts?: Opts): import("../types.js").ValtheraQuery;
}
export default SQLParser;
