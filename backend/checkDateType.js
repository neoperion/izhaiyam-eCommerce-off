const mongoose = require("mongoose");
const User = require("./models/userData");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const checkDateType = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const users = await User.findOne({ "orders.0": { $exists: true } });
    
    if (users && users.orders.length > 0) {
        const order = users.orders[users.orders.length - 1]; // Check latest
        console.log("Order Date Value:", order.date);
        console.log("Order Date Type:", typeof order.date);
        console.log("Constructor:", order.date.constructor.name);
        console.log("Products Length:", order.products ? order.products.length : "undefined");
        if (order.products && order.products.length > 0) {
            console.log("First Product:", JSON.stringify(order.products[0], null, 2));
        }
    } else {
        console.log("No orders found.");
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkDateType();
