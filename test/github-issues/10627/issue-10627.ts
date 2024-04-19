import { expect } from "chai"
import { DataSource } from "../../../src"
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases,
} from "../../utils/test-utils"
import { Category } from "./entity/Category"
import { Post, PostEx } from "./entity/Post"

describe("github issues > #10627", () => {
    let connections: DataSource[]
    before(
        async () =>
            (connections = await createTestingConnections({
                entities: [Category, Post, PostEx],
                enabledDrivers: ["sqlite"],
                logging: true,
            })),
    )
    beforeEach(() => reloadTestingDatabases(connections))
    after(() => closeTestingConnections(connections))

    describe("query execution and retrieval", () => {
        it("should return a single entity for getOne when found", () =>
            Promise.all(
                connections.map(async (connection) => {
                    await Promise.all([
                        connection.getRepository(Post).save({
                            id: 1,
                            title: "Post",
                            description: "Post description",
                            rating: 0,
                            categoryId: 1,
                        }),
                        connection.getRepository(Post).save({
                            id: 2,
                            title: "Post",
                            description: "Post description",
                            rating: 0,
                            categoryId: 2,
                        }),
                        connection.getRepository(Category).save({
                            id: 1,
                            name: "Category",
                            description: "Category description",
                        }),
                    ])

                    const entity1 = await connection
                        .createQueryBuilder(Post, "post")
                        .where("post.id = :id", { id: 1 })
                        .getOne()

                    expect(entity1).not.to.be.null
                    expect(entity1!.id).to.equal(1)
                    expect(entity1!.title).to.equal("Post")

                    const entity2 = await connection
                        .createQueryBuilder(PostEx, "post")
                        .where("post.id = :id", { id: 1 })
                        .getOne()

                    expect(entity2).not.to.be.null
                    expect(entity2!.id).to.equal(1)
                    expect(entity2!.title).to.equal("Post")
                    expect(entity2?.categoryName).to.undefined
                }),
            ))

        it("should return a full entity", () =>
            Promise.all(
                connections.map(async (connection) => {
                    await Promise.all([
                        connection.getRepository(Post).save({
                            id: 1,
                            title: "Post",
                            description: "Post description",
                            rating: 0,
                            categoryId: 1,
                        }),
                        connection.getRepository(Post).save({
                            id: 2,
                            title: "Post",
                            description: "Post description",
                            rating: 0,
                            categoryId: 2,
                        }),
                        connection.getRepository(Category).save({
                            id: 1,
                            name: "Category",
                            description: "Category description",
                        }),
                    ])

                    const entity1 = await connection
                        .createQueryBuilder(PostEx, "p")
                        .innerJoin(Category, "c", "p.category_id = c.id")
                        .addSelect("c.name", "p_category_name")
                        .andWhere("p.id = :id", { id: 1 })
                        .getOne()

                    expect(entity1).not.to.be.null
                    expect(entity1!.id).to.equal(1)
                    expect(entity1!.title).to.equal("Post")
                    expect(entity1!.categoryName).to.equal("Category")

                    const entity2 = await connection
                        .createQueryBuilder(PostEx, "p")
                        .leftJoin(Category, "c", "p.category_id = c.id")
                        .addSelect("c.name", "p_category_name")
                        .andWhere("p.id = :id", { id: 2 })
                        .getOne()

                    expect(entity2).not.to.be.null
                    expect(entity2!.id).to.equal(2)
                    expect(entity2!.title).to.equal("Post")
                    expect(entity2!.categoryName).to.null
                }),
            ))
        it("should return a particular column", () =>
            Promise.all(
                connections.map(async (connection) => {
                    await Promise.all([
                        connection.getRepository(Post).save({
                            id: 1,
                            title: "Post",
                            description: "Post description",
                            rating: 0,
                            categoryId: 1,
                        }),
                        connection.getRepository(Post).save({
                            id: 2,
                            title: "Post",
                            description: "Post description",
                            rating: 0,
                            categoryId: 2,
                        }),
                        connection.getRepository(Category).save({
                            id: 1,
                            name: "Category",
                            description: "Category description",
                        }),
                    ])

                    const entity1 = await connection
                        .createQueryBuilder(PostEx, "p")
                        .leftJoin(Category, "c", "p.category_id = c.id")
                        .select("p.id", "p_id")
                        .addSelect("c.name", "p_category_name")
                        .andWhere("p.id = :id", { id: 1 })
                        .getOne()

                    expect(entity1).not.to.be.null
                    expect(entity1!.id).to.equal(1)
                    expect(entity1!.categoryName).to.equal("Category")
                    expect(entity1?.title).to.undefined

                    const entity2 = await connection
                        .createQueryBuilder(PostEx, "p")
                        .leftJoin(Category, "c", "p.category_id = c.id")
                        .select("p.id", "p_id")
                        .addSelect("c.name", "p_category_name")
                        .andWhere("p.id = :id", { id: 2 })
                        .getOne()

                    expect(entity2).not.to.be.null
                    expect(entity2!.id).to.equal(2)
                    expect(entity2!.categoryName).to.null
                    expect(entity2?.title).to.undefined
                }),
            ))
    })
})
