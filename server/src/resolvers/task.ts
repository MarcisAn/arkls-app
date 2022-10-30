import {User} from "../entities/User";
import {MyContext} from "src/types";
import {Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware,} from "type-graphql";
import {isAuth} from "../middleware/isAuth";
import {Task} from "../entities/Task";
import {FieldError} from "./user";

@InputType()
class PostTaskInput {
    @Field()
    title: string;
    @Field()
    hours: number;
    @Field()
    category: string;
}

@InputType()
class PostIDInput {
    @Field()
    id: string;
}

@ObjectType()
class LoginResponse {
    @Field(() => User)
    user: User;
    @Field(() => [FieldError], {nullable: true})
    errors?: Error[];
}
@ObjectType()
class TaskResponse {
    @Field(() => Task, {nullable: true})
    task?: Task;
    @Field(() => [FieldError], {nullable: true})
    errors?: Error[];
}

@Resolver()
export class TaskResolver {

    @UseMiddleware(isAuth)
    @Mutation(() => Task)
    async postTask(@Ctx() {req, em}: MyContext,
                   @Arg("options") options: PostTaskInput) {
        // @ts-ignore
        const user = await em.findOne(User, {id: req.session.userId})
        const task = em.create(Task, {
            // @ts-ignore
            user: user,
            title: options.title,
            category: options.category,
            points: options.hours * 10

        })
        await em.persistAndFlush(task)
        return task;
    }

    @UseMiddleware(isAuth)
    @Query(() => TaskResponse)
    async getTask(@Ctx() {req, em}: MyContext, @Arg("options") options: PostIDInput) {
        const task = await em.findOne(Task, {id: parseInt(options.id)})

        // @ts-ignore
        const user = await em.findOne(User, {id: req.session.userId}, {populate: ["friends"]})
        // @ts-ignore
        await task.user.friends.init()
        //@ts-ignore
        console.log(task)

        // @ts-ignore
        if (task.user.friends.contains(user) || task.user.id == user?.id) {
            return {task: task};
        } else {
            return {
                errors: [
                    {
                        field: "id",
                        message: "uzdevuma autors nav draugs",
                    },
                ],
            };
        }
    }


}
