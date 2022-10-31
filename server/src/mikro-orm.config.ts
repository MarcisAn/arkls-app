import { User } from "./entities/User";
import path from "path";
import { MikroORM } from "@mikro-orm/core";
import {Comment} from "./entities/Comment";
import {Task} from "./entities/Task";
import {__prod__} from "./constants"

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [User,Comment, Task],
  dbName: "arkls-prodapp",
  type: "postgresql",
  user: "postgres",
  password: "postgres",
  debug: false,
  allowGlobalContext: true,
} as unknown as Parameters<typeof MikroORM.init>;
