import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://SiteCrafteAi:KAVGx0LRAPwsH1tB@cluster0.zzma2xb.mongodb.net/?appName=Cluster0";

const UserSchema = new mongoose.Schema({
  email: String,
  isEmailVerified: Boolean,
  accountPurpose: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function checkUsers() {
  await mongoose.connect(MONGODB_URI);
  const users = await User.find({});
  console.log("Registered Users:");
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}

checkUsers();
