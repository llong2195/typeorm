import { Entity, PrimaryGeneratedColumn, Column } from "../../../../src"

@Entity("category")
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string
}
