export class JoinToRelationsEngine {
    defaultDbKey;
    tableDbMap;
    knownForeignKeys = new Set();
    constructor(defaultDbKey, tableDbMap) {
        this.defaultDbKey = defaultDbKey;
        this.tableDbMap = tableDbMap;
    }
    identifyPkFk(left, right, mainTable, knownFks) {
        const [leftTable, leftField] = left.split(".");
        const [rightTable, rightField] = right.split(".");
        if (leftTable === mainTable)
            return { pk: left, fk: right };
        else if (rightTable === mainTable)
            return { pk: right, fk: left };
        if (knownFks.has(left))
            return { pk: right, fk: left };
        else if (knownFks.has(right))
            return { pk: left, fk: right };
        // If either of the above conditions are met, use a heuristic: set pk to the field named "id" or "_id"
        if (leftField === "id" || leftField === "_id") {
            return { pk: left, fk: right };
        }
        else if (rightField === "id" || rightField === "_id") {
            return { pk: right, fk: left };
        }
        // If still unsure, throw an error
        throw new Error(`Cannot determine pk/fk from condition: "${left} = ${right}"`);
    }
    buildRelations(joinClauses, mainTable) {
        const relations = {};
        const knownFks = new Set(this.knownForeignKeys);
        for (const [alias, condition] of Object.entries(joinClauses)) {
            const [left, right] = condition.split(/\s*=\s*/);
            const { pk, fk } = this.identifyPkFk(left, right, mainTable, knownFks);
            const [pkTable, pkField] = pk.split(".");
            const [fkTable, fkField] = fk.split(".");
            knownFks.add(fk);
            const dbKey = this.tableDbMap?.[fkTable] || this.defaultDbKey;
            relations[alias] = {
                type: "1n",
                path: [dbKey, fkTable],
                pk: pkField,
                fk: fkField,
                as: alias,
            };
        }
        this.knownForeignKeys = knownFks;
        return relations;
    }
}
//# sourceMappingURL=join.util.js.map