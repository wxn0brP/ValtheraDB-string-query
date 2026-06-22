import { parseReturn } from "#sql/utils";
import { parseWhere } from "#sql/where";
import { Opts, ValtheraQuery } from "#types.js";
import { JoinToRelationsEngine } from "#sql/utils/join.util";
import type { DbFindOpts } from "@wxn0brp/db-core/types/options";

type SelectClauses = {
    mainQueryPart: string;
    whereClauseStr?: string;
    groupClauseStr?: string;
    dbFindOpts: DbFindOpts;
};

export function handleSelect(
    query: string,
    opts?: Opts,
): ValtheraQuery {
    const { mainQueryPart, whereClauseStr, groupClauseStr, dbFindOpts } = parseSelectClauses(query);

    const match = mainQueryPart.match(/SELECT\s+(.+?)\s+FROM\s+([\w\/]+)((?:\s+JOIN\s+.+)*)?/i);
    if (!match) throw new Error(formatSelectSyntaxError(mainQueryPart));

    const columnsPart = match[1].trim();
    const collection = match[2];
    const joinPart = match[3] || "";
    const whereClause = whereClauseStr ? parseWhere(whereClauseStr) : {};

    const findOpts = parseSelectClause(columnsPart);
    Object.assign(dbFindOpts, parseAggregateSelectClause(columnsPart));
    if (groupClauseStr !== undefined) {
        dbFindOpts.groupBy = parseGroupClause(groupClauseStr);
    }

    if (joinPart && opts?.defaultDbKey) {
        const joinClauses = parseJoinClauses(joinPart);
        const relationsEngine = new JoinToRelationsEngine(opts.defaultDbKey, opts.tableDbMap);
        const relations = relationsEngine.buildRelations(joinClauses, collection);
        const path = [opts.defaultDbKey, collection];

        return {
            method: "relation-find",
            query: {},
            relation: [path, whereClause, relations, findOpts, dbFindOpts]
        }
    }

    return parseReturn("find", collection, { search: whereClause, findOpts, dbFindOpts });
}

function parseSelectClauses(query: string): SelectClauses {
    const whereIndex = findKeywordOutsideQuotes(query, "WHERE");
    const groupIndex = findKeywordOutsideQuotes(query, "GROUP BY");
    const orderIndex = findKeywordOutsideQuotes(query, "ORDER BY");
    const reverseIndex = findReverseClauseIndex(query);
    const offsetIndex = findNumericClauseIndex(query, "OFFSET");
    const limitIndex = findNumericClauseIndex(query, "LIMIT", offsetIndex === -1 ? query.length : offsetIndex);
    const clauseIndexes = [whereIndex, groupIndex, orderIndex, limitIndex, offsetIndex, reverseIndex].filter(i => i !== -1);
    const mainEnd = clauseIndexes.length ? Math.min(...clauseIndexes) : query.length;

    const mainQueryPart = query.substring(0, mainEnd).trim();
    const whereClauseStr = whereIndex !== -1
        ? query.substring(whereIndex + "WHERE".length, nextClauseIndex(query.length, whereIndex, [groupIndex, orderIndex, limitIndex, offsetIndex, reverseIndex])).trim()
        : undefined;
    const groupClauseStr = groupIndex !== -1
        ? query.substring(groupIndex + "GROUP BY".length, nextClauseIndex(query.length, groupIndex, [orderIndex, limitIndex, offsetIndex, reverseIndex])).trim()
        : undefined;
    const orderClauseStr = orderIndex !== -1
        ? query.substring(orderIndex + "ORDER BY".length, nextClauseIndex(query.length, orderIndex, [limitIndex, offsetIndex, reverseIndex])).trim()
        : undefined;
    const limitClauseStr = limitIndex !== -1
        ? query.substring(limitIndex + "LIMIT".length, nextClauseIndex(query.length, limitIndex, [offsetIndex, reverseIndex])).trim()
        : undefined;
    const offsetClauseStr = offsetIndex !== -1
        ? query.substring(offsetIndex + "OFFSET".length, nextClauseIndex(query.length, offsetIndex, [reverseIndex])).trim()
        : undefined;

    const dbFindOpts: DbFindOpts = {};

    if (orderClauseStr !== undefined) {
        Object.assign(dbFindOpts, parseOrderClause(orderClauseStr));
    }
    if (limitClauseStr !== undefined) {
        dbFindOpts.limit = parseNonNegativeIntegerClause("LIMIT", limitClauseStr);
    }
    if (offsetClauseStr !== undefined) {
        dbFindOpts.offset = parseNonNegativeIntegerClause("OFFSET", offsetClauseStr);
    }
    if (reverseIndex !== -1) {
        dbFindOpts.reverse = true;
    }

    return { mainQueryPart, whereClauseStr, groupClauseStr, dbFindOpts };
}

function findKeywordOutsideQuotes(input: string, keyword: string, start: number = 0): number {
    const upperInput = input.toUpperCase();
    const upperKeyword = keyword.toUpperCase();
    let quote: string | undefined;

    for (let i = start; i <= input.length - keyword.length; i++) {
        const char = input[i];
        if ((char === "'" || char === '"' || char === "`") && input[i - 1] !== "\\") {
            quote = quote === char ? undefined : quote || char;
            continue;
        }
        if (quote) continue;

        if (upperInput.startsWith(upperKeyword, i) && hasKeywordBoundary(input, i, keyword.length)) {
            return i;
        }
    }

    return -1;
}

function findNumericClauseIndex(input: string, keyword: "LIMIT" | "OFFSET", nextIndex: number = input.length): number {
    let searchStart = 0;

    while (searchStart < input.length) {
        const keywordIndex = findKeywordOutsideQuotes(input, keyword, searchStart);
        if (keywordIndex === -1) return -1;

        const valuePart = input.substring(keywordIndex + keyword.length, nextIndex).trim();
        if (/^[=<>!]/.test(valuePart)) {
            searchStart = keywordIndex + keyword.length;
            continue;
        }
        if (!/^\d+$/.test(valuePart)) throw new Error(`Invalid ${keyword} value`);

        return keywordIndex;
    }

    return -1;
}

function findReverseClauseIndex(input: string): number {
    let searchStart = 0;

    while (searchStart < input.length) {
        const keywordIndex = findKeywordOutsideQuotes(input, "REVERSE", searchStart);
        if (keywordIndex === -1) return -1;

        const valuePart = input.substring(keywordIndex + "REVERSE".length).trim();
        if (/^[=<>!]/.test(valuePart)) {
            searchStart = keywordIndex + "REVERSE".length;
            continue;
        }
        if (valuePart && !/^(LIMIT|OFFSET|ORDER\s+BY|GROUP\s+BY)\b/i.test(valuePart)) {
            throw new Error("Invalid REVERSE syntax");
        }

        return keywordIndex;
    }

    return -1;
}

function hasKeywordBoundary(input: string, index: number, length: number) {
    const before = input[index - 1];
    const after = input[index + length];
    return (!before || /\s/.test(before)) && (!after || /\s/.test(after));
}

function nextClauseIndex(fallback: number, currentIndex: number, indexes: number[]) {
    const nextIndexes = indexes.filter(index => index !== -1 && index > currentIndex);
    return nextIndexes.length ? Math.min(...nextIndexes) : fallback;
}

function parseOrderClause(orderClause: string): DbFindOpts {
    if (/^random\(\)$/i.test(orderClause)) {
        return {
            sortBy: "random()",
        };
    }

    const match = orderClause.match(/^([\w./]+)(?:\s+(ASC|DESC))?$/i);
    if (!match) throw new Error(`Invalid ORDER BY syntax near '${orderClause || "ORDER BY"}'`);

    return {
        sortBy: match[1],
        sortAsc: match[2]?.toUpperCase() !== "DESC",
    };
}

function parseNonNegativeIntegerClause(name: "LIMIT" | "OFFSET", clause: string) {
    if (!/^\d+$/.test(clause)) throw new Error(`Invalid ${name} value`);
    return Number(clause);
}

function parseAggregateSelectClause(selectClause: string): DbFindOpts {
    const dbFindOpts: DbFindOpts = {};

    for (const part of splitSelectParts(selectClause)) {
        const aggregateStart = part.match(/^(MIN|MAX|AVG|COUNT)\b/i);
        const match = part.match(/^(MIN|MAX|AVG|COUNT)\(\s*([\w./]+)\s*\)(?:\s+AS\s+([\w.]+))?$/i);
        if (aggregateStart && !match) {
            throw new Error(`Invalid aggregate expression '${part}'`);
        }
        if (!match) continue;

        const aggregate = match[1].toLowerCase() as "min" | "max" | "avg" | "count";
        const field = match[2];
        const alias = match[3] || `${aggregate}_${field.replace(/[./]/g, "_")}`;
        dbFindOpts[aggregate] ||= {};
        dbFindOpts[aggregate]![alias] = field;
    }

    return dbFindOpts;
}

function parseGroupClause(groupClause: string) {
    const groupBy = groupClause.split(/\s*,\s*/).filter(Boolean);
    if (!groupBy.length) throw new Error("Invalid GROUP BY syntax near 'GROUP BY'");
    const invalidKey = groupBy.find(key => !/^[\w./]+$/.test(key));
    if (invalidKey) throw new Error(`Invalid GROUP BY key '${invalidKey}'`);
    return groupBy.length === 1 ? groupBy[0] : groupBy;
}

function formatSelectSyntaxError(query: string) {
    if (!/^SELECT\b/i.test(query)) return `Invalid SELECT syntax near '${query}'`;
    if (!/\bFROM\b/i.test(query)) return "Invalid SELECT syntax: missing FROM";

    const columns = query.match(/^SELECT\s*(.*?)\s+FROM\b/i)?.[1]?.trim();
    if (!columns) return "Invalid SELECT syntax: missing select list before FROM";

    const collection = query.match(/\bFROM\s*([^\s]*)/i)?.[1]?.trim();
    if (!collection) return "Invalid SELECT syntax: missing collection after FROM";
    if (!/^[\w/]+$/.test(collection)) return `Invalid SELECT collection '${collection}'`;

    return `Invalid SELECT syntax near '${query}'`;
}

export function parseJoinClauses(joinPart: string): Record<string, string> {
    const joinClauses: Record<string, string> = {};
    const joinRegex = /\s+JOIN\s+([\w\/]+)(?:\s+AS\s+)?([\w\/]+)?\s+ON\s+([^\s]+)\s*=\s*([^\s]+)/gi;
    let match: RegExpExecArray | null;
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
    if (hasAggregateSelect(selectClause)) return {};

    const excludeMatch = selectClause.match(/\*\s+EXCLUDE\s+(.+)/i);
    if (excludeMatch) {
        return {
            exclude: excludeMatch[1].split(/\s*,\s*/),
        };
    }

    return {
        select: splitSelectParts(selectClause),
    };
}

function hasAggregateSelect(selectClause: string) {
    return splitSelectParts(selectClause).some(part => /^(MIN|MAX|AVG|COUNT)\(/i.test(part));
}

function splitSelectParts(selectClause: string) {
    return selectClause.split(/\s*,\s*/).map(part => part.trim()).filter(Boolean);
}
