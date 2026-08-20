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
//# sourceMappingURL=collection.js.map