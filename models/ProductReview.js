const mongoose = require("mongoose");

const productReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    reviewerName: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    isApproved: {
      type: Boolean,
      default: true, // Auto-approved for admin-created reviews
    },
    createdBy: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
productReviewSchema.index({ productId: 1 });
productReviewSchema.index({ rating: 1 });

const ProductReview = mongoose.model("ProductReview", productReviewSchema);

module.exports = ProductReview;
