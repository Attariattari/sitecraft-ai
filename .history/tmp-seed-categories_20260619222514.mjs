import dbConnect from "./src/lib/dbConnect.js";
import { seedCategories } from "./src/lib/categories/categoryService.js";

async function runSeed() {
  try {
    console.log("Connecting to DB...");
    await dbConnect();
    console.log("Seeding categories...");
    const result = await seedCategories();
    console.log("Result:", result);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

runSeed();
