require("dotenv").config();
const productJson = require("./productsJSON");
const connectDb = require("./db/connect");
const Products = require("./models/products");

const populateDb = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDb(process.env.MONGO_URI);
    console.log("✅ Connected to database successfully!");
    
    console.log("🗑️  Deleting existing products...");
    await Products.deleteMany();
    console.log("✅ Existing products deleted");
    
    console.log("📦 Creating sample products...");
    await Products.create(productJson);
    console.log(`✅ Successfully added ${productJson.length} products to the database!`);
    
    console.log("🎉 Database population complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

populateDb();
