import { parseReturn } from "../utils/index.js";
export function handleGet(query) {
    if (!/^GET\s+COLLECTIONS$/i.test(query)) {
        throw new Error("Invalid GET COLLECTIONS syntax.");
    }
    return parseReturn("getCollections");
}
export function handleCreate(query) {
    const match = query.match(/^CREATE\s+(?:TABLE|COLLECTION)\s+(IF\s+NOT\s+EXISTS\s+)?(\w+).*/i);
    if (!match)
        throw new Error("Invalid CREATE TABLE/COLLECTION syntax.");
    return parseReturn("ensureCollection", match[2]);
}
export function handleDrop(query) {
    const match = query.match(/^DROP\s+(?:TABLE|COLLECTION)\s+(?:IF\s+EXISTS\s+)?(\w+)$/i);
    if (!match)
        throw new Error("Invalid DROP TABLE/COLLECTION syntax.");
    return parseReturn("removeCollection", match[1]);
}
export function handleExists(query) {
    const match = query.match(/^EXISTS\s+(?:TABLE|COLLECTION)\s+(\w+)$/i);
    if (!match)
        throw new Error("Invalid EXISTS TABLE/COLLECTION syntax.");
    return parseReturn("issetCollection", match[1]);
}
export function handleCreateIndex(query) {
    const match = query.match(/^CREATE\s+(UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?(`?[\w./]+`?)\s+ON\s+([\w/]+)\s*\(([^)]+)\)$/i);
    if (!match)
        throw new Error("Invalid CREATE INDEX syntax.");
    const fields = parseIndexFields(match[4]);
    const collection = match[3];
    return parseReturn("createIndex", collection, {
        index: {
            collection,
            fields,
            opts: {
                unique: !!match[1],
                name: match[2].replace(/`/g, ""),
            },
        },
    });
}
export function handleDropIndex(query) {
    const match = query.match(/^DROP\s+INDEX\s+(?:IF\s+EXISTS\s+)?(`?[\w./]+`?)\s+ON\s+([\w/]+)\s*\(([^)]+)\)$/i);
    if (!match)
        throw new Error("Invalid DROP INDEX syntax.");
    const collection = match[2];
    const fields = parseIndexFields(match[3]);
    return parseReturn("removeIndex", collection, {
        index: {
            collection,
            fields,
            opts: {
                name: match[1].replace(/`/g, ""),
            },
        },
    });
}
function parseIndexFields(raw) {
    const fields = raw
        .split(",")
        .map(f => f.trim().replace(/`/g, ""))
        .filter(Boolean);
    if (!fields.length)
        throw new Error("Index requires at least one field");
    for (const field of fields) {
        if (!/^[\w./]+$/.test(field))
            throw new Error(`Invalid index field '${field}'`);
    }
    return fields;
}
//# sourceMappingURL=collection.js.map