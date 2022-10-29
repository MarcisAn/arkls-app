import {Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Float, Int, ObjectType} from "type-graphql";
import {User} from "./User";
import {Comment} from "./Comment";

@ObjectType()
@Entity()
export class Task {
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => Date)
    @Property({type: "date"})
    createdAt: Date = new Date();

    @Field(() => String)
    @Property({onUpdate: () => new Date(), type: "date"})
    updatedAt = new Date();

    @Field(() => User)
    @ManyToOne(() => User)
    user: User

    @Field(() => String)
    @Property()
    title: string

    @Field(() => String)
    @Property()
    category: string

    @Field(() => Int)
    @Property({type: "int"})
    points: number

    @Field(() => [Comment])
    @OneToMany(() => Comment,comment => comment.task)
    comments = new Collection<Comment>(this)

}
