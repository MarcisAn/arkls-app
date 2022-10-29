import "reflect-metadata";
import "dotenv/config";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { __prod__, COOKIE_NAME } from "./constants";
import cors from "cors";
import fs from "fs"
import {TaskResolver} from "./resolvers/task";

async function main() {
    //@ts-ignore
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();
    //@ts-ignore

    //console.log(await orm.em.find(User, {}));

    const app = express();
    //app.use(cors({ origin: "http://localhost:5173", credentials: true }));
    app.use(cors({ origin: "http://localhost:5173", credentials: true }));


    const RedisStore = connectRedis(session);

    //@ts-ignore
    const redis = new Redis(process.env.REDIS_URL);
    app.set("trust proxy", 1);
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        })
    );
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: "lax", // csrf
                secure: __prod__, // cookie only works in https
                domain: __prod__ ? "arkls.lv" : undefined,
            },
            saveUninitialized: false,
            //@ts-ignore
            secret: process.env.SESSION_SECRET,
            resave: false,
        })
    );
    const em = orm.em;
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, TaskResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            em,
        }),
    });
    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    app.get("/pfp",function(req,res) {
        // @ts-ignore
        //TODO: iespējams path traversal
        fs.readFile(process.env.PFP_LOCATION +"/"+ req.query.username+".png", (err,data)=>{
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        })
    })

    app.listen(4000, () => {
        console.log("server on 4000");
    });
}

main().catch((err) => {
    console.error(err);
});
