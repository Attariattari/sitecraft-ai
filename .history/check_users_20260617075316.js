import dbConnect from "./src/lib/dbConnect.js";
import User from "./src/models/User.js";
import mongoose from "mongoose";

async function checkUsers() {
  await dbConnect();
  const users = await User.find({}, { email: 1, isEmailVerified: 1 });
  console.log("Registered Users:");
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}

checkUsers();
