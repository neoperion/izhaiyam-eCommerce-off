const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/userData");
const Product = require("../models/products");
const CustomErrorHandler = require("../errors/customErrorHandler");
const mongoose = require("mongoose");
const { createNotification } = require("./notificationController");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, products } = req.body;
    console.log("Debugging Razorpay Key:", process.env.RAZORPAY_KEY_ID ? "Loaded" : "Missing"); // DEBUG log

    if (!amount) {
      throw new CustomErrorHandler(400, "Amount is required");
    }

    // 1. Validate Stock Before Creating Payment Order
    if (products && Array.isArray(products)) {
        for (const item of products) {
            const product = await Product.findById(item.productId || item._id); // Handle both formats
            if (!product) {
                throw new CustomErrorHandler(404, `Product not found: ${item.name}`);
            }
            if (product.stock < item.quantity) {
                throw new CustomErrorHandler(400, `Insufficient Main Product Stock for "${product.title}". Requested: ${item.quantity}, Available: ${product.stock}. (Variant stock is ignored).`);
            }
        }
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      throw new CustomErrorHandler(500, "Some error occurred");
    }

    res.status(200).json({
        ...order,
        key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    throw new CustomErrorHandler(error.statusCode || 500, error.message);
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
      // Find and update MAIN product stock
      const product = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stock: { $gte: item.quantity }
        },
        {
          $inc: { stock: -item.quantity }
        },
        { new: true, session }
      );

      if (!product) {
        // Atomic update failed, let's diagnose WHY (Product missing vs Stock low)
        const checkProduct = await Product.findById(item.productId || item._id);
        if (!checkProduct) {
             throw new CustomErrorHandler(404, `Product not found: ${item.name || item.productId}`);
        } else {
             throw new CustomErrorHandler(400, `Insufficient Main Product Stock for "${checkProduct.title}". Requested: ${item.quantity}, Available: ${checkProduct.stock}. (Variant stock is ignored).`);
        }
      }
      
      // Notification Logic
      if (product.stock === 0) {
         product.status = "Out of Stock";
         await product.save({ session });
          try {
             await createNotification({
               title: "Out of Stock",
               message: `"${product.title}" is now out of stock!`,
               type: "error",
               productId: product._id
             });
          } catch(e) { console.error("Notification error", e); }

      } else if (product.stock < 10) {
           try {
             await createNotification({
               title: "Low Stock Alert",
               message: `Only ${product.stock} units left for "${product.title}"`,
               type: "warning",
               productId: product._id
             });
          } catch(e) { console.error("Notification error", e); }
      } else if (product.status === "Out of Stock" && product.stock > 0) {
          product.status = "In Stock";
          await product.save({ session });
      }

         // Build Snapshot
         let snapshot = {
              productId: item.productId,
              quantity: item.quantity,
              name: product.title,
              price: product.price,
              image: product.image,
              customization: { enabled: false },
              selectedColor: {},
              wood: { type: "Not Selected", price: 0 },
              woodType: "Not Selected",
              woodPrice: 0
         };

         // Variant - Customization
         if (item.selectedColor && (item.selectedColor.primaryColorName || item.selectedColor.name)) {
             snapshot.customization = {
                enabled: true,
                primaryColor: item.selectedColor.primaryColorName || item.selectedColor.name || "N/A",
                secondaryColor: item.selectedColor.secondaryColorName || "N/A",
                primaryHex: item.selectedColor.primaryHexCode || item.selectedColor.hexCode,
                secondaryHex: item.selectedColor.secondaryHexCode,
                imageUrl: item.selectedColor.imageUrl
             };
             snapshot.selectedColor = {
                ...item.selectedColor,
                name: item.selectedColor.name || item.selectedColor.primaryColorName
             };
             if(item.selectedColor.imageUrl) snapshot.image = item.selectedColor.imageUrl;
         }

          // Variant - Wood
         if (item.woodType || (item.wood && item.wood.type)) {
            const wType = item.wood?.type || item.woodType || "Not Selected";
            const wPrice = item.wood?.price || item.woodPrice || 0;

            snapshot.wood = {
                type: wType,
                price: wPrice
            };
            snapshot.woodType = wType;
            snapshot.woodPrice = wPrice;
             // Use wood price if it's the effective price
             if(item.price) snapshot.price = item.price; 
         }

      formattedProducts.push(snapshot);
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

    // Trigger New Order Notification
    try {
        await createNotification({
            title: "New Order Received",
            message: `Order #${razorpay_order_id} placed by ${orderDetails.username || 'Customer'}`,
            type: "info",
            productId: null,
            io: req.io
        });

        // Also emit New Order event for Order List management
        if(req.io) req.io.emit("order:new", { ...orderDetails, orderId: razorpay_order_id });

    } catch(e) { console.error("Notification trigger failed", e); }

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
