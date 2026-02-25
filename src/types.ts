import { VQuery } from "@wxn0brp/db-core/types/query";

export interface ValtheraQuery {
    method: string;
    query: VQuery;
    /** If the method is "relation-find" */
    relation?: any[];
}

export interface Opts {
    defaultDbKey: string;
    tableDbMap?: Record<string, string>;
}

export interface ValtheraParser {
    parse(
        query: string,
        opts?: Opts,
    ): ValtheraQuery;
}
