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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9pbi51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NxbC91dGlscy9qb2luLnV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsTUFBTSxPQUFPLHFCQUFxQjtJQUlsQjtJQUNBO0lBSkosZ0JBQWdCLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7SUFFbEQsWUFDWSxZQUFvQixFQUNwQixVQUFtQztRQURuQyxpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUNwQixlQUFVLEdBQVYsVUFBVSxDQUF5QjtJQUMzQyxDQUFDO0lBRUcsWUFBWSxDQUFDLElBQVksRUFBRSxLQUFhLEVBQUUsU0FBaUIsRUFBRSxRQUFxQjtRQUN0RixNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWxELElBQUksU0FBUyxLQUFLLFNBQVM7WUFDdkIsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDO2FBQzlCLElBQUksVUFBVSxLQUFLLFNBQVM7WUFDN0IsT0FBTyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDO1FBRW5DLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDbEIsT0FBTyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQzlCLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDeEIsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBRW5DLHNHQUFzRztRQUN0RyxJQUFJLFNBQVMsS0FBSyxJQUFJLElBQUksU0FBUyxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQzVDLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNuQyxDQUFDO2FBQU0sSUFBSSxVQUFVLEtBQUssSUFBSSxJQUFJLFVBQVUsS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUNyRCxPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDbkMsQ0FBQztRQUVELGtDQUFrQztRQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxJQUFJLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRU0sY0FBYyxDQUNqQixXQUF1QixFQUN2QixTQUFpQjtRQUVqQixNQUFNLFNBQVMsR0FBMkIsRUFBRSxDQUFDO1FBQzdDLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRWhELEtBQUssTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7WUFDM0QsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRWpELE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUV2RSxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXpDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7WUFFOUQsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHO2dCQUNmLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7Z0JBQ3RCLEVBQUUsRUFBRSxPQUFPO2dCQUNYLEVBQUUsRUFBRSxPQUFPO2dCQUNYLEVBQUUsRUFBRSxLQUFLO2FBQ1osQ0FBQztRQUNOLENBQUM7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO1FBRWpDLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7Q0FDSiJ9