const mongoose = require("mongoose");
const Product = require("./models/products");
require('dotenv').config();

const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const start = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI || "mongodb+srv://Izhaiyam:1234@cluster0.w3b7s.mongodb.net/NEOPERION?retryWrites=true&w=majority";
    await connectDB(mongoUrl);
    console.log("Connected to DB");

    const featuredCount = await Product.countDocuments({ isFeatured: true });
    console.log(`Found ${featuredCount} featured products.`);

    if (featuredCount === 0) {
      console.log("No featured products found. Marking the first 4 products as featured...");
      const products = await Product.find({}).limit(4);
      for (const product of products) {
        product.isFeatured = true;
        await product.save();
        console.log(`Marked product "${product.title}" as featured.`);
      }
    } else {
        const products = await Product.find({ isFeatured: true });
        products.forEach(p => console.log(`- ${p.title} (Featured)`));
    }

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
