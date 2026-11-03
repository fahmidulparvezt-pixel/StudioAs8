import { MongoClient } from "mongodb";

let client;
let db;

export async function getDb() {
  if (!db) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    client = new MongoClient(uri);
    await client.connect();

    db = client.db(process.env.DB_NAME || "studiospace");

    await db.collection("bookings").createIndex({
      studioId: 1,
      date: 1,
      status: 1,
    });

    await db.collection("studios").createIndex({
      ownerEmail: 1,
    });

    console.log("MongoDB connected successfully");
  }

  return db;
}