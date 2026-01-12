const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/userData");
const Product = require("../models/products");
const CustomErrorHandler = require("../errors/customErrorHandler");
const mongoose = require("mongoose");

// Initialize Razorpay
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn("WARNING: Razorpay keys are missing. Payment operations will fail.");
}

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("Debugging Razorpay Key:", process.env.RAZORPAY_KEY_ID ? "Loaded" : "Missing"); // DEBUG log

    if (!amount) {
      throw new CustomErrorHandler(400, "Amount is required");
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    if (!razorpay) {
      throw new CustomErrorHandler(500, "Razorpay is not configured on the server");
    }

    const order = await razorpay.orders.create(options);

    if (!order) {
      throw new CustomErrorHandler(500, "Some error occurred");
    }

    res.status(200).json({
        ...order,
        key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

// Verify Payment and Place Order
const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession().catch(() => null);

  try {
    if (session) {
      session.startTransaction();
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails // Contains products, address, user info, etc.
    } = req.body;

    // 1. Signature Verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      throw new CustomErrorHandler(400, "Payment verification failed: Invalid Signature");
    }

    // 2. Deduct Stock & Build Snapshot
    const { products, email } = orderDetails;
    const formattedProducts = [];

    // Validate User exists first
    const user = await User.findOne({ email }).session(session);
    if (!user) {
         throw new CustomErrorHandler(404, "User not found");
    }

    for (let item of products) {
      let product;
      let snapshot = {
          productId: item.productId,
          quantity: item.quantity
      };

      // OPTION A: Specific Color Variant
      if (item.selectedColor && (item.selectedColor.primaryColorName || item.selectedColor.colorName)) {
        const colorField = item.selectedColor.primaryColorName ? "primaryColorName" : "colorName";
        const colorValue = item.selectedColor.primaryColorName || item.selectedColor.colorName;
        
        product = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            "colorVariants": {
              $elemMatch: {
                [colorField]: colorValue,
                stock: { $gte: item.quantity }
              }
            }
          },
          {
            $inc: { "colorVariants.$.stock": -item.quantity }
          },
          { new: true, session }
        );

         // Add Snapshot Data for Variant
         if(product) {
             snapshot.name = product.title;
             snapshot.price = product.price;
             snapshot.image = product.image; // Fallback main image
             
             // Variant Details
             snapshot.selectedColor = {
                primaryColorName: item.selectedColor.primaryColorName,
                primaryHexCode: item.selectedColor.primaryHexCode,
                secondaryColorName: item.selectedColor.secondaryColorName,
                secondaryHexCode: item.selectedColor.secondaryHexCode,
                isDualColor: item.selectedColor.isDualColor || false,
                imageUrl: item.selectedColor.imageUrl, // Priority image
                name: item.selectedColor.colorName || item.selectedColor.primaryColorName,
                hexCode: item.selectedColor.hexCode || item.selectedColor.primaryHexCode
             };
         }

      } else {
        // OPTION B: Main Product Stock
        product = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            stock: { $gte: item.quantity }
          },
          {
            $inc: { stock: -item.quantity }
          },
          { new: true, session }
        );
        
        // Add Snapshot Data for Main Product
        if(product) {
            snapshot.name = product.title;
            snapshot.price = product.price;
            snapshot.image = product.image;
        }
      }

      if (!product) {
        throw new CustomErrorHandler(400, `Product/Variant out of stock: ${item.name || item.productId}`);
      }

      formattedProducts.push(snapshot);

      // Update Status if Stock hits 0 (Simplified logic from Orders.js)
       if (!item.selectedColor?.colorName) { 
        if (product.stock === 0) {
           product.status = "Out of Stock";
           await product.save({ session });
        }
      }
    }

    // 3. Format Order Data
    const formattedOrder = {
      products: formattedProducts,
      username: orderDetails.username,
      shippingMethod: orderDetails.shippingMethod,
      email: orderDetails.email,
      phone: orderDetails.phone,
      addressType: orderDetails.addressType,
      addressLine1: orderDetails.addressLine1,
      addressLine2: orderDetails.addressLine2,
      address: orderDetails.address, // formatted address string if available
      city: orderDetails.city,
      state: orderDetails.state,
      country: orderDetails.country,
      postalCode: orderDetails.postalCode,
      totalAmount: orderDetails.totalAmount,
      deliveryStatus: "pending",
      paymentStatus: "paid", // CONFIRMED PAID
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
    };

    // 4. Save Address if requested
    let updateQuery = { $push: { orders: formattedOrder } };

     if (orderDetails.saveAddress && email) {
        // Reuse logic: check if address exists
         const addressExists = user.savedAddresses.some(addr => 
            addr.addressLine1.toLowerCase() === orderDetails.addressLine1.toLowerCase() && 
            addr.postalCode === orderDetails.postalCode
        );
        
        if (!addressExists) {
            const newAddress = {
                addressType: orderDetails.addressType || "Home",
                addressLine1: orderDetails.addressLine1,
                addressLine2: orderDetails.addressLine2 || "",
                city: orderDetails.city,
                state: orderDetails.state,
                country: orderDetails.country,
                postalCode: orderDetails.postalCode,
                isDefault: user.savedAddresses.length === 0
            };
            updateQuery.$push.savedAddresses = newAddress;
        }
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      updateQuery,
      { new: true, session }
    );

    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified and Order placed successfully",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    });

  } catch (error) {
     if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error("Payment Verification Error:", error);
    throw new CustomErrorHandler(error.statusCode || 500, error.message || "Payment Verification Failed");
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
