const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/userData");
const Product = require("../models/products");
const Order = require("../models/orderModel"); // NEW
const CustomErrorHandler = require("../errors/customErrorHandler");
const mongoose = require("mongoose");
const { createNotification } = require("./notificationController");
const { sendSMS } = require("../lib/twilio");
const { sendPaymentSuccessEmail, sendAdminPaymentReceivedEmail } = require("../services/emailService");

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, products } = req.body;
    if (!amount) throw new CustomErrorHandler(400, "Amount is required");

    // Stock Check
    for (const item of products) {
        const product = await Product.findById(item.productId || item._id);
        if (!product) throw new CustomErrorHandler(404, `Product not found`);
        if (product.stock < item.quantity) throw new CustomErrorHandler(400, `Insufficient Stock: ${product.title}`);
    }

    if (!razorpay) throw new CustomErrorHandler(500, "Razorpay Not Configured");

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({ ...order, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    throw new CustomErrorHandler(error.statusCode || 500, error.message);
  }
};

const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession().catch(() => null);

  try {
    if (session) session.startTransaction();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;

    // 1. Signature Verify
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");
    if (expectedSignature !== razorpay_signature) throw new CustomErrorHandler(400, "Invalid Signature");

    // 2. Stock Deduct & Snapshot Builder (Reused Logic idea - simplistic here for brevity)
    const { products, email } = orderDetails;
    const user = await User.findOne({ email }).session(session);
    if (!user) throw new CustomErrorHandler(404, "User not found");

    const formattedProducts = [];
    for (let item of products) {
        const product = await Product.findOneAndUpdate(
            { _id: item.productId, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { new: true, session }
        );
        if(!product) throw new CustomErrorHandler(400, "Stock error during payment processing");

        // Simple Snapshot Logic for now (Should match Orders.js ideally)
        formattedProducts.push({
            productId: item.productId,
            name: product.title,
            image: product.image,
            price: product.price,
            quantity: item.quantity,
            category: "Others", // Simplified fallback
            wood: item.wood ? { type: item.wood.type, price: item.wood.price } : { type: "Not Selected", price: 0 },
            customization: { enabled: false }
            // Add other fields as needed matching Schema
        });
    }

    // 3. Create ORDER Document
    const newOrder = new Order({
        user: user._id,
        products: formattedProducts,
        username: orderDetails.username,
        email: orderDetails.email,
        phone: orderDetails.phone,
        addressType: orderDetails.addressType,
        addressLine1: orderDetails.addressLine1,
        addressLine2: orderDetails.addressLine2,
        address: orderDetails.address,
        city: orderDetails.city,
        state: orderDetails.state,
        country: orderDetails.country,
        postalCode: orderDetails.postalCode,
        totalAmount: orderDetails.totalAmount,
        shippingMethod: orderDetails.shippingMethod,
        deliveryStatus: "pending",
        paymentStatus: "paid",
        payment: {
            method: "razorpay",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount: orderDetails.totalAmount,
            currency: "INR",
            status: "paid"
        },
        date: Date.now()
    });

    await newOrder.save({ session });

    // 4. Save Address
    if (orderDetails.saveAddress) {
         const addressExists = user.savedAddresses.some(addr => addr.postalCode === orderDetails.postalCode && addr.addressLine1 === orderDetails.addressLine1);
         if (!addressExists) {
             user.savedAddresses.push({
                 addressType: orderDetails.addressType || "Home",
                 addressLine1: orderDetails.addressLine1,
                 city: orderDetails.city,
                 state: orderDetails.state,
                 country: orderDetails.country,
                 postalCode: orderDetails.postalCode
             });
             await user.save({ session });
         }
    }

    if (session) { await session.commitTransaction(); session.endSession(); }

    // Notifications
    try {
        await createNotification({ 
            title: "New Order (Paid)", 
            message: `Order #${newOrder._id} received.`, 
            type: "success", 
            productId: null, 
            io: req.io 
        });
        if(req.io) req.io.emit("order:new", newOrder);
    } catch(e) {}

    sendSMS(orderDetails.phone, `Payment Successful! Order ID: ${newOrder._id}`);
    sendPaymentSuccessEmail(user, { _id: newOrder._id, totalAmount: orderDetails.totalAmount }, razorpay_payment_id);
    sendAdminPaymentReceivedEmail(user, { _id: newOrder._id, totalAmount: orderDetails.totalAmount }, razorpay_payment_id);

    res.status(200).json({ success: true, message: "Order placed", orderId: newOrder._id });

  } catch (error) {
    if (session) { await session.abortTransaction(); session.endSession(); }
    throw new CustomErrorHandler(error.statusCode || 500, error.message);
  }
};

module.exports = { createRazorpayOrder, verifyPayment };
