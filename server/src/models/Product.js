const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      index: "text",
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
      index: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    stock: {
      type: Number,
      default: 0,
    },
    // Metadata
    specs: {
      ram: { type: String, default: "Not Available" },
      storage: { type: String, default: "Not Available" },
      display: { type: String, default: "Not Available" },
      processor: { type: String, default: "Not Available" },
      camera: { type: String, default: "Not Available" },
      battery: { type: String, default: "Not Available" },
      os: { type: String, default: "Not Available" },
      color: { type: String, default: "Not Available" },
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
      index: true,
    },
    isPromoted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for common filter combinations
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1, price: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
