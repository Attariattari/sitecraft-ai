import dbConnect from "./src/lib/dbConnect.js";
import User from "./src/models/User.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env.local") });

async function checkUsers() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI not found in env");
    process.exit(1);
  }
  await dbConnect();
  const users = await User.find({}, { email: 1, isEmailVerified: 1 });
  console.log("Registered Users:");
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}

checkUsers();
