import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const g = globalThis;
const client = (g._studioMongo ??= new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017"));

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.DB_NAME || "studiospace")),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: false },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
});
