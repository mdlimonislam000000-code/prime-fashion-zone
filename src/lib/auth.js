import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// .env.local থেকে ডাটাবেজ কানেকশন নেয়া হচ্ছে
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('primeZoneDB');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user", // ডিফল্টভাবে 'user', অ্যাডমিনদের ক্ষেত্রে 'admin'
      },
    },
  },
});