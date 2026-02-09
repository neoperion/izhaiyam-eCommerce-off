const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please enter your first name"],
    },
    lastName: {
      type: String,
      required: [true, "please enter your last name"],
    },
    username: {
      type: String,
      required: [true, "please enter a username"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "please enter an email"],
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
    },
    adminStatus: {
      type: Boolean,
      default: false,
      enum: [false, true],
    },
    verificationStatus: {
      type: String,
      default: "verified",
    },
    verificationToken: {
      type: String,
    },
    resetOtp: String,
    resetOtpExpiry: Date,
    avatar: String,
    authType: {
      type: String,
      default: "local",
      enum: ["local", "google", "facebook"],
    },
    address: String,
    country: String,
    postalCode: Number,
    city: String,
    shippingMethod: {
      type: String,
      default: "standard",
      enum: ["standard", "express", "free shipping"],
    },
    savedAddresses: [
      {
        addressType: { type: String, enum: ["Home", "Office"], default: "Home" },
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
        isDefault: { type: Boolean, default: false }
      }
    ],
    orders: [
      {
        products: [
          {
            productId: { type: Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number },
            name: String, // Snapshot: Product Title
            image: String, // Snapshot: Product Image URL
            name: String, // Snapshot: Product Title
            image: String, // Snapshot: Product Image URL
            price: Number, // Snapshot: Price at purchase
            
            category: { type: String, required: true, default: "Others" }, // Snapshot: Product Category
            
            // STRICT SEPARATION: Wood vs Customization
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
                imageUrl: String // Snapshot of the specific color variant image if applicable
            },

            // LEGACY FALLBACKS (To prevent crashes on old data)
            selectedColor: { type: Object }, 
            woodType: String,
            woodPrice: Number
          },
        ],
        username: String,
        shippingMethod: String,
        email: String,
        phone: String,
        addressType: { type: String, enum: ["Home", "Office"], default: "Home" },
        addressLine1: String,
        addressLine2: String,
        address: String, // Keep for backward compatibility
        city: String,
        state: String,
        country: String,
        postalCode: String,
        totalAmount: Number,
        deliveryStatus: { 
            type: String, 
            enum: ["pending", "delivered", "cancelled", "Shipped", "shipped", "Processed", "processed", "Pending", "Delivered", "Cancelled", "Processing", "processing"], 
            default: "pending" 
        },
        paymentStatus: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
        payment: {
            method: { type: String, enum: ["razorpay", "cod"], default: "cod" },
            razorpayOrderId: String,
            razorpayPaymentId: String,
            razorpaySignature: String,
            amount: Number,
            currency: String,
            status: { type: String, default: "pending" }
        },
        date: { type: Date, default: Date.now },
        tracking: {
          carrier: String,
          trackingId: String,
          trackingUrl: String,
          liveLocationUrl: String,
          expectedDeliveryDate: Date
        }
      },
    ],
  },
  {
    timeStamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase();
  next();
});

module.exports = mongoose.model("User", userSchema);
