import { User } from "./entities/User";
import path from "path";
import { MikroORM } from "@mikro-orm/core";


export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [User],
  dbName: "arkls-prodapp",
  type: "postgresql",
  user: "postgres",
  password: "postgres",
  debug: false,
  allowGlobalContext: true,
} as unknown as Parameters<typeof MikroORM.init>;
