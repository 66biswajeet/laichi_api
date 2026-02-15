const ProductReview = require("../models/ProductReview");
const Product = require("../models/Product");

// Get all products with their average ratings and review counts
const getAllProductsWithReviews = async (req, res) => {
  try {
    const products = await Product.find({}).select("_id title slug image");

    const productsWithReviews = await Promise.all(
      products.map(async (product) => {
        const reviews = await ProductReview.find({
          productId: product._id,
          isApproved: true,
        });

        const totalReviews = reviews.length;
        const averageRating =
          totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            : 0;

        return {
          _id: product._id,
          title: product.title,
          slug: product.slug,
          image: product.image,
          totalReviews,
          averageRating: averageRating.toFixed(1),
        };
      }),
    );

    res.send({
      products: productsWithReviews,
      totalProducts: productsWithReviews.length,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get all reviews for a specific product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const product =
      await Product.findById(productId).select("title slug image");
    if (!product) {
      return res.status(404).send({
        message: "Product not found!",
      });
    }

    const reviews = await ProductReview.find({ productId }).sort({
      createdAt: -1,
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    res.send({
      product,
      reviews,
      totalReviews: reviews.length,
      averageRating: averageRating.toFixed(1),
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Add a new review
const addProductReview = async (req, res) => {
  try {
    const { productId, reviewerName, comment, rating } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        message: "Product not found!",
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).send({
        message: "Rating must be between 1 and 5!",
      });
    }

    const newReview = new ProductReview({
      productId,
      reviewerName,
      comment,
      rating,
      isApproved: true,
      createdBy: "admin",
    });

    await newReview.save();

    res.status(201).send({
      message: "Review added successfully!",
      review: newReview,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Update a review
const updateProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewerName, comment, rating } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).send({
        message: "Rating must be between 1 and 5!",
      });
    }

    const review = await ProductReview.findByIdAndUpdate(
      id,
      {
        reviewerName,
        comment,
        rating,
      },
      { new: true },
    );

    if (!review) {
      return res.status(404).send({
        message: "Review not found!",
      });
    }

    res.send({
      message: "Review updated successfully!",
      review,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Delete a review
const deleteProductReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await ProductReview.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).send({
        message: "Review not found!",
      });
    }

    res.send({
      message: "Review deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Delete all reviews for a product
const deleteAllProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    await ProductReview.deleteMany({ productId });

    res.send({
      message: "All reviews deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getAllProductsWithReviews,
  getProductReviews,
  addProductReview,
  updateProductReview,
  deleteProductReview,
  deleteAllProductReviews,
};
