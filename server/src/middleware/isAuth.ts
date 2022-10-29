import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    //@ts-ignore
    if (!context.req.session.userId) {
        throw new Error("not authenticated");
    }
    else{
        return next();
    }

};