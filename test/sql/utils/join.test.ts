import { JoinClause, JoinToRelationsEngine } from "#sql/utils/join.util";
import { describe, expect, test } from "bun:test";

describe("SQL Utils - Join", () => {
    test("1. works", () => {
        const joinClauses: JoinClause = {
            comments: "posts.id = comments.post_id",
            users: "comments.user_id = users.id",
            tags: "posts.id = tags.post_id"
        };

        const engine = new JoinToRelationsEngine(
            "defaultDb",
            { comments: "blogDb", users: "userDb" }
        );

        const relations = engine.buildRelations(joinClauses, "posts");

        expect(relations).toBeDefined();
        expect(relations.comments).toEqual({
            type: "1n",
            path: ["blogDb", "comments"],
            pk: "id",
            fk: "post_id",
            as: "comments",
        })
        expect(relations.users).toEqual({
            type: "1n",
            path: ["blogDb", "comments"],
            pk: "id",
            fk: "user_id",
            as: "users",
        })
        expect(relations.tags).toEqual({
            type: "1n",
            path: ["defaultDb", "tags"],
            pk: "id",
            fk: "post_id",
            as: "tags",
        })
    });
});