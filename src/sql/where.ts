type QueryObject = Record<string, any>;

const operators: Record<string, string> = {
    "=": null,
    "<": "$lt",
    ">": "$gt",
    "<=": "$lte",
    ">=": "$gte",
    "!=": "$not",
    "IN": "$in",
    "NOT IN": "$nin",
    "NOT ANY": "$nin",
    "IS": null,
    "IS NOT": "$not"
};

function escapeRegex(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function likeToRegex(pattern: string) {
    const escaped = escapeRegex(pattern);
    const converted = escaped.replace(/%/g, '.*').replace(/_/g, '.');
    return `^${converted}$`;
}

function mergeQueries(target: QueryObject, source: QueryObject) {
    for (const key in source) {
        if (key.startsWith('$')) {
            // If the key is an operator, simply add it
            target[key] = source[key];
        } else {
            // If the key is a field, check if there is not already an operator in the target
            if (target[key] !== undefined) {
                // If target[key] is an object with an operator, merge the objects
                if (typeof target[key] === 'object' && !Array.isArray(target[key])) {
                    Object.assign(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            } else {
                target[key] = source[key];
            }
        }
    }
}

export function parseWhere(where: string): QueryObject {
    if (!where) return {};
    const trimmed = where.trim();
    if (trimmed === "" || trimmed === "1") return {};

    // Tokenize the input string, handling parentheses and quoted values
    const tokens = where
        .replace(/\s+(?=(?:[^'"]*['"][^'"]*['"])*[^'"]*$)/g, " ")
        .match(/(?:\(|\)|'[^']*'|"[^"]*"|>=|<=|!=|<>|=|<|>|[^\s()=<>!]+)/g) || [];

    let frames: Array<{ current: QueryObject, operatorStack: string[], stack: any[] }> = [];
    let current: QueryObject = {};
    let operatorStack: string[] = [];
    let stack: any[] = [];

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i].trim();
        if (!token) continue;

        if (token === '(') {
            // Push current context to the stack and reset for the new group
            frames.push({ current, operatorStack, stack });
            current = {};
            operatorStack = [];
            stack = [];
        } else if (token === ')') {
            // Combine current and stack into a grouped query
            let groupedQuery: QueryObject = current;
            if (stack.length > 0) {
                stack.push(current);
                groupedQuery = { $or: stack };
            }

            if (frames.length === 0) {
                throw new Error("Unmatched closing parenthesis");
            }
            const parentFrame = frames.pop()!;
            const parentCurrent = parentFrame.current;
            const parentOperatorStack = parentFrame.operatorStack;
            const parentStack = parentFrame.stack;

            // Merge the grouped query into the parent context
            if (parentOperatorStack.length > 0) {
                const op = parentOperatorStack.pop();
                if (op === "OR") {
                    parentStack.push(parentCurrent);
                    current = groupedQuery;
                } else if (op === "AND") {
                    const newCurrent: QueryObject = {};
                    mergeQueries(newCurrent, parentCurrent);
                    mergeQueries(newCurrent, groupedQuery);
                    current = newCurrent;
                }
            } else {
                const newCurrent: QueryObject = {};
                mergeQueries(newCurrent, parentCurrent);
                mergeQueries(newCurrent, groupedQuery);
                current = newCurrent;
            }

            // Restore parent's stack and operator stack
            operatorStack = parentFrame.operatorStack;
            stack = parentFrame.stack;
        } else if (token.toUpperCase() === "AND" || token.toUpperCase() === "OR") {
            operatorStack.push(token.toUpperCase());
        } else {
            // Process condition (key, operator, value)
            if (operatorStack.length) {
                const op = operatorStack[operatorStack.length - 1];
                if (op === "OR") {
                    stack.push(current);
                    current = {};
                    operatorStack.pop();
                }
            }

            let key = token;
            if (key.includes(".")) {
                key = key.split(".").pop()!;
            }
            let opToken = tokens[++i]?.trim();
            // Handle multi-word operators
            if (opToken) {
                const upperOp = opToken.toUpperCase();
                const nextToken = tokens[i + 1]?.trim().toUpperCase();

                if (upperOp === "NOT" && (nextToken === "IN" || nextToken === "LIKE" || nextToken === "ANY")) {
                    opToken = `NOT ${nextToken}`;
                    i++;
                } else if (upperOp === "IS") {
                    if (nextToken === "NOT") {
                        opToken = "IS NOT";
                        i++;
                        // Check for NULL
                        if (tokens[i + 1]?.trim().toUpperCase() === "NULL") {
                            // Correctly consume NULL as value
                        }
                    }
                }
            }

            let value: any = tokens[++i]?.trim();

            if (!key || !opToken || value === undefined) {
                throw new Error(`Invalid condition near '${key} ${opToken} ${value}'`);
            }

            // Handle quoted values
            if (typeof value === 'string' && ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"')))) {
                value = value.slice(1, -1);
            }

            // Handle NULL value
            if (typeof value === 'string' && value.toUpperCase() === "NULL") {
                value = null;
            }

            // Parse numeric values
            if (value !== null && !isNaN(Number(value))) {
                value = Number(value);
            }

            // Handle IN, NOT IN, NOT ANY operations
            if (opToken.toUpperCase() === "IN" || opToken.toUpperCase() === "NOT IN" || opToken.toUpperCase() === "NOT ANY") {
                // If the value is just "(", we need to consume tokens until we find the closing ")"
                if (value === "(") {
                    let collected = "(";
                    while (i < tokens.length - 1) {
                        const next = tokens[++i];
                        collected += next;
                        if (next === ")") break;
                    }
                    value = collected;
                }

                if (!value.startsWith("(") || !value.endsWith(")")) {
                    throw new Error(`Invalid syntax for '${opToken}' near '${value}'`);
                }
                value = value.slice(1, -1).split(",").map((v: string) => {
                    v = v.trim();
                    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
                        return v.slice(1, -1);
                    }
                    return isNaN(Number(v)) ? v : Number(v);
                });
            }

            // Handle LIKE/NOT LIKE specially to convert to regex
            if (opToken.toUpperCase() === "LIKE" || opToken.toUpperCase() === "NOT LIKE") {
                if (typeof value !== 'string') {
                    throw new Error(`LIKE value must be a string, got ${value}`);
                }
                const regex = likeToRegex(value);
                const isNot = opToken.toUpperCase() === "NOT LIKE";

                if (isNot) {
                    // NOT LIKE -> {$not: {$regex: {key: regex}}}
                    if (!current["$not"]) current["$not"] = {};
                    if (!current["$not"]["$regex"]) current["$not"]["$regex"] = {};
                    current["$not"]["$regex"][key] = regex;
                } else {
                    // LIKE -> {$regex: {key: regex}}
                    if (!current["$regex"]) current["$regex"] = {};
                    current["$regex"][key] = regex;
                }
                continue; // processing done for this token
            }

            // Map the operator to the query operators
            const mappedOp = operators[opToken.toUpperCase()];

            if (mappedOp !== undefined) {
                if (mappedOp === null) {
                    // "=" operator - direct assignment
                    current[key] = value;
                } else {
                    // Other operators - they go to the root level
                    if (!current[mappedOp]) {
                        current[mappedOp] = {};
                    }
                    (current[mappedOp] as Record<string, any>)[key] = value;
                }
            } else {
                // If operator not found, default to direct assignment
                current[key] = value;
            }
        }
    }

    // Combine any remaining OR conditions
    if (stack.length > 0) {
        stack.push(current);
        return { $or: stack };
    }

    return current;
}