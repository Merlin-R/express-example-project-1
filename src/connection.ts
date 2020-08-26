import { Connection, createConnection } from "typeorm";
import * as Entities from "./entities";

let _connection: Connection;

export async function connect(): Promise<Connection> {
  if (_connection) return _connection;
  return (_connection = await createConnection({
    type: "mongodb",
    entities: Object.values(Entities),
    synchronize: true,
    host: "localhost",
    database: "example-todo-list",
  }));
}

export function connection(): Connection {
  return _connection;
}
