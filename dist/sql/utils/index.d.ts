import { ValtheraQuery } from "../../types.js";
export declare function parseReturn(method: string, args: any[]): ValtheraQuery;
export declare function parseSet(setString: string): {
    [k: string]: any;
};
export declare function removeQuotes(str: string): string;
export declare function parseNum(str: string): string | number;
