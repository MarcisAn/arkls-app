import {Entity, ManyToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";


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

    @Field(() => String)
    @Property({type: "text"})
    firstName!: string;

    @Field(() => String)
    @Property({type: "text"})
    lastName!: string;

    @Property({type: "text"})
    password!: string;

    @Property({type: "int", default: 0})
    tokenVersion: number;

    @Field(() => String, {nullable: true})
    @Property({type: "date", nullable: true})
    birthDate: Date;


}
