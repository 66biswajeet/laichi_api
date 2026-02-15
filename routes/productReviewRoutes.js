const express = require("express");
const router = express.Router();
const {
  getAllProductsWithReviews,
  getProductReviews,
  addProductReview,
  updateProductReview,
  deleteProductReview,
  deleteAllProductReviews,
} = require("../controller/productReviewController");

// Get all products with review stats
router.get("/all", getAllProductsWithReviews);

// Get reviews for a specific product
router.get("/:productId", getProductReviews);

// Add a new review
router.post("/add", addProductReview);

// Update a review
router.put("/:id", updateProductReview);

// Delete a single review
router.delete("/:id", deleteProductReview);

// Delete all reviews for a product
router.delete("/product/:productId", deleteAllProductReviews);

module.exports = router;
