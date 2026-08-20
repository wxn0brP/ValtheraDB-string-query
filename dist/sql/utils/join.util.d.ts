import { RelationTypes } from "@wxn0brp/db-core";
export type JoinClause = Record<string, string>;
export declare class JoinToRelationsEngine {
    private defaultDbKey;
    private tableDbMap?;
    private knownForeignKeys;
    constructor(defaultDbKey: string, tableDbMap?: Record<string, string>);
    private identifyPkFk;
    buildRelations(joinClauses: JoinClause, mainTable: string): RelationTypes.Relation;
}
