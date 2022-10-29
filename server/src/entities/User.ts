import {Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";
import {Task} from "./Task";


@ObjectType()
@Entity()
export class User {
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Property({unique: true})
    email!: string;

    @Field(() => Date)
    @Property({type: "date"})
    createdAt: Date = new Date();

    @Field(() => String)
    @Property({onUpdate: () => new Date(), type: "date"})
    updatedAt = new Date();

    @Field(() => String)
    @Property({type: "text", unique: true})
    username!: string;

    @Property({type: "text"})
    password!: string;

    @Property({type: "int", default: 0})
    tokenVersion: number;

    @ManyToMany(() => User)
    friends: Collection<User> = new Collection<User>(this)

    @Field(() => [Task])
    @OneToMany(() => Task, task => task.user)
    tasks = new Collection<Task>(this)
}
