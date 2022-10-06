import {User} from "../entities/User";
import {MyContext} from "src/types";
import {Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware,} from "type-graphql";
import argon from "argon2";
import {COOKIE_NAME} from "../constants";
import {isAuth} from "../middleware/isAuth";

@ObjectType()
class LoginResponse {
    @Field(() => User)
    user: User;
    @Field(() => [FieldError], {nullable: true})
    errors?: Error[];
}

@InputType()
class UsernameEmail {
    @Field()
    username: string;
    @Field()
    firstName: string;
    @Field()
    lastName: string;
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
class UsernamePasswordInput {
    @Field()
    password: string;
    @Field()
    email: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: Error[];

    @Field({nullable: true})
    user?: User;
}

@ObjectType()
class Test {
    @Field({nullable: true})
    res?: string;
}

@Resolver()
export class UserResolver {
    @Query(() => Test, {nullable: true})
    cav(){
        return {res: "cav"}
    }
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
            firstName: options.firstName,
            lastName: options.lastName,
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
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ) {
        const user = await em.findOne(User, {email: options.email});

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
