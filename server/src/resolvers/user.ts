import {User} from "../entities/User";
import {MyContext} from "src/types";
import {Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware,} from "type-graphql";
import argon from "argon2";
import {COOKIE_NAME} from "../constants";
import {isAuth} from "../middleware/isAuth";



@InputType()
class UsernameEmail {
    @Field()
    username: string;
    @Field()
    password: string;
    @Field()
    email: string;
}

@InputType()
class UserID {
    @Field()
    userid: string;
}

@InputType()
class UsernameInput {
    @Field()
    username: string;
}

@InputType()
class EmailPasswordInput {
    @Field()
    password: string;
    @Field()
    email: string;
}

@ObjectType()
export class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}
@ObjectType()
class LoginResponse {
    @Field(() => User)
    user: User;
    @Field(() => [FieldError], {nullable: true})
    errors?: Error[];
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: Error[];

    @Field({nullable: true})
    user?: User;

    @Field()
    isFriend?: boolean;

    @Field()
    username: string;
}

@Resolver()
export class UserResolver {
    @Query(() => User, {nullable: true})
    me(@Ctx() {req, em}: MyContext) {
        //@ts-ignore
        if (!req.session.userId) {
            return null;
        }
        //@ts-ignore
        const user = em.findOne(User, {id: req.session.userId})
        console.log(user)
        return user;
    }

    @UseMiddleware(isAuth)
    @Mutation(() => Boolean)
    async addFriend(@Ctx() {req, em}: MyContext,
                    @Arg("options") options: UsernameInput) {
        const user = await em.findOne(User, {username: options.username},{populate: ["friends"]})
        if (user) {
            //@ts-ignore
            const owner = await em.findOne(User, {id: req.session.userId}, {populate: ["friends"]})
            if(owner?.friends.contains(user)){
                owner?.friends.remove(user)
                // @ts-ignore
                user?.friends.remove(owner)
            }
            else{
                owner?.friends.add(user)
                // @ts-ignore
                user?.friends.add(owner)
            }
            // @ts-ignore
            await em.persistAndFlush(owner)
            await em.persistAndFlush(user)

            return true;
        } else {
            return null;
        }
    }

    @UseMiddleware(isAuth)
    @Query(() => Boolean)
    async isFriend(@Ctx() {req, em}: MyContext,
                   @Arg("options") options: UsernameInput){
        //@ts-ignore
        const owner = await em.find(User, {id: req.session.userId}, {populate: ["friends"]})
        const user = await em.find(User, {username: options.username}, {populate: ["friends"]})
        //@ts-ignore
        if(owner.friends.contains(user)){
            return true;
        }
        else{
            return false
        }
        //@ts-ignore
        if (owner.id == user.id){
            return null
        }
    }

    @UseMiddleware(isAuth)
    @Query(() => [UserResponse], {nullable: true})
    async getUsers(@Ctx() {req, em}: MyContext) {
        //@ts-ignore
        const users = await em.find(User, {id: {$ne: req.session.userId}}, {populate: ["friends"]})
        let filtered_users = [];
        users.forEach(user => {
            user.friends.init();
            const friends = user.friends.toJSON();
            // @ts-ignore
            user = {...user, isFriend: false}
            friends.forEach(friend => {
                // @ts-ignore
                if(friend.id == req.session.userId){
                    // @ts-ignore
                    user.isFriend = true
                }
            })
            //@ts-ignore
            filtered_users.push(user)
        })
        return filtered_users;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernameEmail,
        @Ctx() {em, req}: MyContext
    ) {
        console.log("register");

        if (options.username.length <= 3) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "lietotājvārdam jābūt garākam par 3 simboliem",
                    },
                ],
            };
        }
        if (options.password.length <= 4) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "parolei jābūt garākai par 4 simboliem",
                    },
                ],
            };
        }
        const testUser = await em.findOne(User, {username: options.username});
        if (testUser) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "šāds lietotājvārds jau eksistē",
                    },
                ],
            };
        }
        const hashedPassword = await argon.hash(options.password);
        //@ts-ignore
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword,
            email: options.email,
        });
        console.log(user);

        try {
            console.log("here");

            await em.persistAndFlush(user);
            //@ts-ignore
        } catch (err) {
            console.log(err.message);
            return {
                // TODO: atsevišķi kļūdas ziņojumi e-pastam un lietotājvārdam
                errors: [
                    {
                        field: "username/email",
                        message: "reģistrēšanās neizdevās",
                    },
                ],
            };
        }
        //@ts-ignore
        req.session.userId = user.id;

        return {user};
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("options") options: EmailPasswordInput,
        @Ctx() {em, req}: MyContext
    ) {
        console.log(options)
        const user = await em.findOne(User, {email: options.email});
        console.log(user)
        if (!user) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "e-pasts neeksistē",
                    },
                ],
            };
        }
        const valid = await argon.verify((await user).password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "parole nepareiza",
                    },
                ],
            };
        }
        console.log(user);

        //@ts-ignore
        req.session.userId = user.id;
        console.log(req.session);

        return {
            user,
        };
    }

    @Mutation(() => Boolean)
    logout(@Ctx() {req, res}: MyContext) {
        return new Promise((resolve) =>
            req.session.destroy((err) => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            })
        );
    }
}
