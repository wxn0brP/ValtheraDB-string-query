import { ValtheraParser } from "../types.js";
declare class SQLParser implements ValtheraParser {
    parse(query: string): import("../types.js").ValtheraQuery;
}
export default SQLParser;
