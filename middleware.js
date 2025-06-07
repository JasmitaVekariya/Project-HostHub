const Listing = require("./models/listing")
const ExpressError = require('./utils/ExpressError');
const { listingSchema} = require('./schema.js');
const { reviewSchema } = require('./schema.js');
const Review = require("./models/review.js");


module.exports.IsLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //redirect url after login
        req.session.redirectUrl = req.originalUrl; // Store the original URL
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveReturnTo = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.returnTo = req.session.redirectUrl; // Make returnTo available in views
    }
    next();
}

module.exports.isOwner = async (req, res ,next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {   
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(', ');
        return next(new ExpressError( errMsg, 400));
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(', ');
        return next(new ExpressError( errMsg, 400));
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};