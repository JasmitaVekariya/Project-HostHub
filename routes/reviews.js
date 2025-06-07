const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/review');
const wrapAsync = require('../utils/wrapAsync');
const { IsLoggedIn, validateReview, isAuthor } = require('../middleware');

// Create Review
router.post('/', IsLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review
router.delete('/:reviewId', IsLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;