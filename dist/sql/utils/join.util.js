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
        // Check if one of the fields is already known as a foreign key
        const leftFull = `${leftTable}.${leftField}`;
        const rightFull = `${rightTable}.${rightField}`;
        if (knownFks.has(leftFull))
            return { pk: right, fk: left };
        else if (knownFks.has(rightFull))
            return { pk: left, fk: right };
        // If either of the above conditions are met, use a heuristic: set pk to the field named "id" or "_id"
        if (leftField === "id" || leftField === "_id") {
            return { pk: left, fk: right };
        }
        else if (rightField === "id" || rightField === "_id") {
            return { pk: right, fk: left };
        }
        if (leftTable === mainTable)
            return { pk: left, fk: right };
        else if (rightTable === mainTable)
            return { pk: right, fk: left };
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
            knownFks.add(`${fkTable}.${fkField}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9pbi51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NxbC91dGlscy9qb2luLnV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsTUFBTSxPQUFPLHFCQUFxQjtJQUlsQjtJQUNBO0lBSkosZ0JBQWdCLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7SUFFbEQsWUFDWSxZQUFvQixFQUNwQixVQUFtQztRQURuQyxpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUNwQixlQUFVLEdBQVYsVUFBVSxDQUF5QjtJQUMzQyxDQUFDO0lBRUcsWUFBWSxDQUFDLElBQVksRUFBRSxLQUFhLEVBQUUsU0FBaUIsRUFBRSxRQUFxQjtRQUN0RixNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWxELCtEQUErRDtRQUMvRCxNQUFNLFFBQVEsR0FBRyxHQUFHLFNBQVMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUM3QyxNQUFNLFNBQVMsR0FBRyxHQUFHLFVBQVUsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUVoRCxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUM5QixJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO1lBQzVCLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUVuQyxzR0FBc0c7UUFDdEcsSUFBSSxTQUFTLEtBQUssSUFBSSxJQUFJLFNBQVMsS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUM1QyxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDbkMsQ0FBQzthQUFNLElBQUksVUFBVSxLQUFLLElBQUksSUFBSSxVQUFVLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDckQsT0FBTyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ25DLENBQUM7UUFFRCxJQUFJLFNBQVMsS0FBSyxTQUFTO1lBQ3ZCLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQzthQUM5QixJQUFJLFVBQVUsS0FBSyxTQUFTO1lBQzdCLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUVuQyxrQ0FBa0M7UUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsSUFBSSxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVNLGNBQWMsQ0FDakIsV0FBdUIsRUFDdkIsU0FBaUI7UUFFakIsTUFBTSxTQUFTLEdBQTJCLEVBQUUsQ0FBQztRQUM3QyxNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVoRCxLQUFLLE1BQU0sQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQzNELE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVqRCxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFdkUsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV6QyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFFdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7WUFFOUQsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHO2dCQUNmLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7Z0JBQ3RCLEVBQUUsRUFBRSxPQUFPO2dCQUNYLEVBQUUsRUFBRSxPQUFPO2dCQUNYLEVBQUUsRUFBRSxLQUFLO2FBQ1osQ0FBQztRQUNOLENBQUM7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO1FBRWpDLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7Q0FDSiJ9