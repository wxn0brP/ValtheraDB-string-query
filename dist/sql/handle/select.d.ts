import { Opts, ValtheraQuery } from "../../types.js";
export declare function handleSelect(query: string, opts?: Opts): ValtheraQuery;
export declare function parseJoinClauses(joinPart: string): Record<string, string>;
export declare function parseSelectClause(selectClause: string): {
    select?: string[];
    exclude?: string[];
};
