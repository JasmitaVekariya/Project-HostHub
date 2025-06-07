const Review = require('../models/review');
const Listing = require('../models/listing');

// Create a review
module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const { comment, rating } = req.body;

    if (!comment || !rating) {
        req.flash('error', 'Comment and rating are required');
        return res.redirect(`/listings/${id}`);
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }

    const review = new Review({ comment, rating, author: req.user._id });
    await review.save();

    listing.reviews.push(review._id);
    await listing.save();

    req.flash('success', 'Review created successfully!');
    res.redirect(`/listings/${id}`);
};

// Delete a review
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
};