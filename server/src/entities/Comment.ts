import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";
import {User} from "./User";
import {Task} from "./Task";


@ObjectType()
@Entity()
export class Comment {
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

    @Field(() => Task)
    @ManyToOne(() => Task)
    task: Task

}
