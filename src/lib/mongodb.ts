import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "unlock_the_pouch";

if (!uri) {
  console.warn(
    "MONGODB_URI is not set. API routes that need DB will return an error.",
  );
}

let client: MongoClient | null = null;

export function getMongoClient() {
  if (!uri) throw new Error("Missing MONGODB_URI");
  if (client) return client;

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  return client;
}

export async function getDb() {
  const mongoClient = getMongoClient();
  await mongoClient.connect();
  return mongoClient.db(dbName);
}
