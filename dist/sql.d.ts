import { ValtheraParser, ValtheraQuery } from "./types.js";
declare class ValtheraSQLParser implements ValtheraParser {
    parse(query: string): ValtheraQuery;
    private parseReturn;
    private handleSelect;
    private parseSelectClause;
    private handleInsert;
    private handleUpdate;
    private handleDelete;
    private parseWhere;
    private buildQueryTree;
    private parseSingleCondition;
    private parseSet;
}
declare const valtheraSQLParser: ValtheraSQLParser;
export default valtheraSQLParser;
