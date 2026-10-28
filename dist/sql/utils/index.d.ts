import { VQuery } from "@wxn0brp/db-core/types/query";
import { ValtheraQuery } from "../../types.js";
export declare const COLLECTION_SRC = "`[^`]+`|\"[^\"]+\"|[\\w/]+";
export declare const FIELD_SRC = "(?:`[^`]+`|\"[^\"]+\"|[\\w/]+)(?:\\.(?:`[^`]+`|\"[^\"]+\"|[\\w/]+))*";
export declare function parseReturn(method: string, collection?: string, query?: VQuery): ValtheraQuery;
export declare function parseSet(setString: string): {
    [k: string]: any;
};
export declare function removeQuotes(str: string): string;
/** Strip surrounding identifier quotes (backticks or double quotes). */
export declare function stripIdentQuotes(str: string): string;
/** Split on a single-char separator, ignoring separators inside quotes. */
export declare function splitOutsideQuotes(input: string, separator: string): string[];
/** Last field in a path: `users`.`id` -> id */
export declare function lastPathPart(value: string): string;
/** Field path without the document/collection qualifier: `users`.`id` -> id */
export declare function normalizeFieldPath(value: string, collection?: string): string;
export declare function parseNum(str: string): string | number;
