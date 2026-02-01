import { Opts } from "../../types.js";
export declare function handleSelect(query: string, opts?: Opts): import("../../types.js").ValtheraQuery;
export declare function parseJoinClauses(joinPart: string): Record<string, string>;
export declare function parseSelectClause(selectClause: string): {
    select?: string[];
    exclude?: string[];
};
