import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB || "real-alpha";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

type GlobalMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as GlobalMongo;

const clientPromise =
  globalForMongo._mongoClientPromise ??
  new MongoClient(uri, {
    appName: "project-realalpha",
  }).connect();

if (!globalForMongo._mongoClientPromise) {
  globalForMongo._mongoClientPromise = clientPromise;
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(databaseName);
}

export const mongoCollectionName =
  process.env.MONGODB_COLLECTION || "real-alpha";