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
    address: String,
    country: String,
    postalCode: Number,
    city: String,
    shippingMethod: {
      type: String,
      default: "standard",
      enum: ["standard", "express", "free shipping"],
    },
    orders: [
      {
        products: [
          {
            productId: { type: Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number },
            selectedColor: {
              name: String,
              hexCode: String,
              imageUrl: String,
            },
          },
        ],
        username: String,
        shippingMethod: String,
        email: String,
        address: String,
        country: String,
        postalCode: Number,
        city: String,
        totalAmount: Number,
        deliveryStatus: { type: String, enum: ["pending", "delivered", "cancelled", "Shipped", "shipped"] },
        paymentStatus: { type: String, enum: ["pending", "paid", "cancelled"] },
        date: { type: Date, default: Date.now },
        tracking: {
            carrier: String,
            trackingId: String,
            trackingUrl: String
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
