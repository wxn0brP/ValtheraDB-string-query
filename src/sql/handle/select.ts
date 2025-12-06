import { parseReturn } from "#sql/utils";
import { parseWhere } from "#sql/where";
import { Opts } from "#types.js";
import { JoinToRelationsEngine } from "#sql/utils/join.util";

export function handleSelect(
    query: string,
    opts?: Opts,
) {
    let whereClauseStr: string | undefined;
    let mainQueryPart = query;

    const whereIndex = query.toUpperCase().lastIndexOf(" WHERE ");
    if (whereIndex !== -1) {
        whereClauseStr = query.substring(whereIndex + 7).trim();
        mainQueryPart = query.substring(0, whereIndex);
    }

    const match = mainQueryPart.match(/SELECT\s+(.+?)\s+FROM\s+([\w\/]+)((?:\s+JOIN\s+.+)*)?/i);
    if (!match) throw new Error("Invalid SELECT syntax");

    const columnsPart = match[1].trim();
    const collection = match[2];
    const joinPart = match[3] || "";
    const whereClause = whereClauseStr ? parseWhere(whereClauseStr) : {};

    const findOpts = parseSelectClause(columnsPart);

    if (joinPart && opts?.defaultDbKey) {
        const joinClauses = parseJoinClauses(joinPart);
        const relationsEngine = new JoinToRelationsEngine(opts.defaultDbKey, opts.tableDbMap);
        const relations = relationsEngine.buildRelations(joinClauses, collection);
        const path = [opts.defaultDbKey, collection];
        return parseReturn("relation-find", [path, whereClause, relations, findOpts]);
    }

    return parseReturn("find", [collection, whereClause, {}, findOpts]);
}

export function parseJoinClauses(joinPart: string): Record<string, string> {
    const joinClauses: Record<string, string> = {};
    const joinRegex = /\s+JOIN\s+([\w\/]+)(?:\s+AS\s+)?([\w\/]+)?\s+ON\s+([^\s]+)\s*=\s*([^\s]+)/gi;
    let match;
    while ((match = joinRegex.exec(joinPart)) !== null) {
        const table = match[1];
        const alias = match[2] || table;
        const condition = `${match[3]} = ${match[4]}`;
        joinClauses[alias] = condition;
    }
    return joinClauses;
}

export function parseSelectClause(selectClause: string): { select?: string[]; exclude?: string[] } {
    selectClause = selectClause.trim();

    if (selectClause === "*") return {};

    const excludeMatch = selectClause.match(/\*\s+EXCLUDE\s+(.+)/i);
    if (excludeMatch) {
        return {
            exclude: excludeMatch[1].split(/\s*,\s*/),
        };
    }

    return {
        select: selectClause.split(/\s*,\s*/),
    };
}
