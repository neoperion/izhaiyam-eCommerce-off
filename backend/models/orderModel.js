const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    // Link to the User who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Product Details (Snapshot)
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
        
        // Snapshots
        name: String, 
        image: String, 
        price: Number, 
        
        category: { type: String, required: true, default: "Others" },
        
        // Strict Separation: Wood vs Customization
        wood: {
            type: { type: String, required: true, default: "Not Selected" },
            price: { type: Number, default: 0 }
        },
        
        customization: {
            enabled: { type: Boolean, default: false },
            primaryColor: { type: String, default: null },
            secondaryColor: { type: String, default: null },
            primaryHex: String,
            secondaryHex: String,
            imageUrl: String // Snapshot of the specific color variant image
        },

        // Legacy Fallbacks
        selectedColor: { type: Object }, 
        woodType: String,
        woodPrice: Number
      },
    ],

    // Customer & Shipping Info
    username: String,
    email: String,
    phone: String, // Ensure this is captured at top level for easy access
    
    // Address Snapshot
    addressType: { type: String, enum: ["Home", "Office"], default: "Home" },
    addressLine1: String,
    addressLine2: String,
    address: String, // Legacy full string
    city: String,
    state: String,
    country: String,
    postalCode: String,
    shippingMethod: String,

    // Financials
    totalAmount: Number,
    
    // Statuses
    deliveryStatus: { 
        type: String, 
        enum: ["pending", "delivered", "cancelled", "Shipped", "shipped", "Processed", "processed", "Pending", "Delivered", "Cancelled"], 
        default: "pending" 
    },
    paymentStatus: { 
        type: String, 
        enum: ["pending", "paid", "cancelled"], 
        default: "pending" 
    },
    
    // Payment Details
    payment: {
        method: { type: String, enum: ["razorpay", "cod"], default: "cod" },
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
        amount: Number,
        currency: String,
        status: { type: String, default: "pending" }
    },

    // Tracking Info
    tracking: {
      carrier: String,
      trackingId: String,
      trackingUrl: String,
      liveLocationUrl: String,
      expectedDeliveryDate: Date
    },

    // Date
    date: { type: Date, default: Date.now }
  },
  {
    timestamps: true, // Auto-manage createdAt/updatedAt
  }
);

// Indexes for faster searching
orderSchema.index({ user: 1 });
orderSchema.index({ email: 1 });
orderSchema.index({ "payment.razorpayPaymentId": 1 });

module.exports = mongoose.model("Order", orderSchema);
