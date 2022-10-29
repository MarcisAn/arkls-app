import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response} from "express";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  res: Response;
  req:  Request;
  payload: any;
};
