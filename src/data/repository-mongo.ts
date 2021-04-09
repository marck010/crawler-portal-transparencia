
import { getClient } from "./mongo";
import { Military } from "../prototypes/military";

const dbName = "db-data";
const collection = "military";

export async function insert (data: Military[]): Promise<number> {
  const clientMongo = getClient();
  const col = clientMongo.db(dbName).collection(collection);

  const result = await col.insertMany(data);

  return result.insertedCount;
}

export async function list (): Promise<Military[]> {
  const clientMongo = getClient();
  const col = clientMongo.db(dbName).collection(collection);

  return col.find({}).toArray();
}
