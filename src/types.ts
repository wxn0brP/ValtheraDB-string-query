export interface ValtheraQuery {
    method: string;
    args: any[];
}

export interface ValtheraParser {
    parse(query: string): ValtheraQuery;
}