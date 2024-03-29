import { Column, Entity, PrimaryColumn } from "../../../../src"

@Entity("post")
export class Post {
    @PrimaryColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    rating: number

    @Column({ name: "category_id" })
    categoryId: number
}

// VirtualEntity
@Entity("post", { synchronize: false })
export class PostEx extends Post {
    @Column({ select: false, name: "category_name", type: "varchar" })
    categoryName: string

    @Column({ select: false, name: "category_description", type: "varchar" })
    description: string
}
