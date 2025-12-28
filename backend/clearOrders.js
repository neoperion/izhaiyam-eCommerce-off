const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/userData');

const clearAllOrders = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear all orders from all users
        const result = await User.updateMany(
            {},
            { $set: { orders: [] } }
        );

        console.log(`✅ Successfully cleared orders from ${result.modifiedCount} users`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing orders:', error);
        process.exit(1);
    }
};

clearAllOrders();
