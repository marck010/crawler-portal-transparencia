import { MongoClient } from "mongodb";

let client: MongoClient;

export async function connect (url: string): Promise<void> {
  client = await MongoClient.connect(url, { useUnifiedTopology: true });
}

export function getClient (): MongoClient {
  return client;
};
