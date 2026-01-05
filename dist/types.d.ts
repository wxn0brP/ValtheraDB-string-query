export interface ValtheraQuery {
    method: string;
    args: any[];
}
export interface Opts {
    defaultDbKey: string;
    tableDbMap?: Record<string, string>;
}
export interface ValtheraParser {
    parse(query: string, opts?: Opts): ValtheraQuery;
}
