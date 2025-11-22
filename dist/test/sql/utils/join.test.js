import { JoinToRelationsEngine } from "../../../sql/utils/join.util.js";
import { describe, expect, test } from "bun:test";
describe("SQL Utils - Join", () => {
    test("works", () => {
        const joinClauses = {
            comments: "posts.id = comments.post_id",
            users: "comments.user_id = users.id",
            tags: "posts.id = tags.post_id"
        };
        const engine = new JoinToRelationsEngine("defaultDb", { comments: "blogDb", users: "userDb" });
        const relations = engine.buildRelations(joinClauses, "posts");
        expect(relations).toBeDefined();
        expect(relations.comments).toEqual({
            type: "1n",
            path: ["blogDb", "comments"],
            pk: "id",
            fk: "post_id",
            as: "comments",
        });
        expect(relations.users).toEqual({
            type: "1n",
            path: ["blogDb", "comments"],
            pk: "id",
            fk: "user_id",
            as: "users",
        });
        expect(relations.tags).toEqual({
            type: "1n",
            path: ["defaultDb", "tags"],
            pk: "id",
            fk: "post_id",
            as: "tags",
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9pbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Rlc3Qvc3FsL3V0aWxzL2pvaW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWMscUJBQXFCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFbEQsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUM5QixJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNmLE1BQU0sV0FBVyxHQUFlO1lBQzVCLFFBQVEsRUFBRSw2QkFBNkI7WUFDdkMsS0FBSyxFQUFFLDZCQUE2QjtZQUNwQyxJQUFJLEVBQUUseUJBQXlCO1NBQ2xDLENBQUM7UUFFRixNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFxQixDQUNwQyxXQUFXLEVBQ1gsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FDMUMsQ0FBQztRQUVGLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTlELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUMvQixJQUFJLEVBQUUsSUFBSTtZQUNWLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUM7WUFDNUIsRUFBRSxFQUFFLElBQUk7WUFDUixFQUFFLEVBQUUsU0FBUztZQUNiLEVBQUUsRUFBRSxVQUFVO1NBQ2pCLENBQUMsQ0FBQTtRQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzVCLElBQUksRUFBRSxJQUFJO1lBQ1YsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQztZQUM1QixFQUFFLEVBQUUsSUFBSTtZQUNSLEVBQUUsRUFBRSxTQUFTO1lBQ2IsRUFBRSxFQUFFLE9BQU87U0FDZCxDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUMzQixJQUFJLEVBQUUsSUFBSTtZQUNWLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUM7WUFDM0IsRUFBRSxFQUFFLElBQUk7WUFDUixFQUFFLEVBQUUsU0FBUztZQUNiLEVBQUUsRUFBRSxNQUFNO1NBQ2IsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9