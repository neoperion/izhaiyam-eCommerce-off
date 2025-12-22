const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product's title is required"],
    },
    price: {
      type: Number,
      required: [true, "Product's price is required"],
    },
    stock: {
      type: Number,
      default: 100,
    },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock"
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    discountPercentValue: {
      type: Number,
      default: function () {
        return !this.discountPercentValue && 0;
      },
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product's image is required"],
    },
    categories: {
      "Featured Categories": { type: [String], enums: ["featured", "first order deal", "discounts"] },
      location: { type: [String], enums: ["kitchen", "dining", "bedroom", "living room", "office", "balcony"] },
      features: { type: [String], enums: ["chairs", "tables", "sets", "cupboards", "lighting", "sofa", "cot", "diwan", "swing"] },
      others: { type: [String], enums: ["kids"] },
    },
    isCustomizable: {
      type: Boolean,
      default: false,
    },
    colorVariants: [
      {
        colorName: { type: String }, // Renamed from name
        hexCode: { type: String },
        imageUrl: { type: String },
        stock: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
// const productCategories = {
//   "Featured Categories": ["featured", "first order deal", "discounts"],
//   location: ["kitchen", "dining", "bedroom", "living room", "office"],
//   features: ["chairs", "tables", "sets", "cupboards", "lighting", "sofa"],
//   others: ["kids"],
// };
