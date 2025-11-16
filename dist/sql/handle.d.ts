export declare function handleSelect(query: string): import("../types.js").ValtheraQuery;
export declare function parseSelectClause(selectClause: string): {
    select?: string[];
    exclude?: string[];
};
export declare function handleInsert(query: string): import("../types.js").ValtheraQuery;
export declare function handleUpdate(query: string): import("../types.js").ValtheraQuery;
export declare function handleDelete(query: string): import("../types.js").ValtheraQuery;
export declare function handleGet(query: string): import("../types.js").ValtheraQuery;
export declare function handleCreate(query: string): import("../types.js").ValtheraQuery;
export declare function handleDrop(query: string): import("../types.js").ValtheraQuery;
export declare function handleExists(query: string): import("../types.js").ValtheraQuery;
