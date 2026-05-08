const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const mongoose = require("mongoose");
const { reviewSchema } = require("./schema.js");
const { FALLBACK_MONGO_URL } = require("./config/db.js");
const ExpressError = require("./utils/ExpressError.js");

const fallbackConnection = mongoose.createConnection(FALLBACK_MONGO_URL);
const FallbackListing = fallbackConnection.model("Listing", Listing.schema);
const FallbackReview = fallbackConnection.model("Review", Review.schema);

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in to create a listing!");
        return res.redirect("/login");
    }

    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }

    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id) || await FallbackListing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    if (!listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You can only manage your own listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId) || await FallbackReview.findById(reviewId);

    if (!review) {
        req.flash("error", "Review you requested for does not exist!");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author || !review.author.equals(req.user._id)) {
        req.flash("error", "You can only delete your own review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
