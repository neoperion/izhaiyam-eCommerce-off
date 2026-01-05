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
        // New dual-color fields
        variantName: { type: String }, // Display name (e.g., "Red + Yellow")
        primaryColorName: { type: String },
        primaryHexCode: { type: String },
        secondaryColorName: { type: String }, // Optional for dual-color
        secondaryHexCode: { type: String }, // Optional for dual-color
        isDualColor: { type: Boolean, default: false },
        
        // Legacy fields for backward compatibility
        colorName: { type: String }, // Deprecated - use primaryColorName
        hexCode: { type: String }, // Deprecated - use primaryHexCode
        
        imageUrl: { type: String },
        stock: { type: Number, default: 0 },
      },
    ],
    // New Wood Pricing & A/B Testing Fields
    isWoodCustomizable: {
      type: Boolean,
      default: false,
    },
    woodVariants: [
      {
        woodType: { type: String, required: true }, // e.g., "Acacia", "Teak"
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        isDefault: { type: Boolean, default: false },
        description: { type: String }, // Optional micro-text like "Premium durability"
      }
    ],
    abTestConfig: {
      enabled: { type: Boolean, default: false },
      groupAVariant: { type: String, default: "Acacia" }, // Default for Group A
      groupBVariant: { type: String, default: "Teak" },   // Default for Group B
      trafficSplit: { type: Number, default: 50 }, // Percentage for Group A (50 = 50/50)
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    displayRow: {
      type: Number,
    },
    displayColumn: {
      type: Number,
    },
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
