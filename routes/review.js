const express = require("express");
const mongoose = require("mongoose");

const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { FALLBACK_MONGO_URL } = require("../config/db.js");

const fallbackConnection = mongoose.createConnection(FALLBACK_MONGO_URL);
const FallbackListing = fallbackConnection.model("Listing", Listing.schema);
const FallbackReview = fallbackConnection.model("Review", Review.schema);

function buildReviewSnapshot(reviewDoc) {
    return {
        reviewId: reviewDoc._id,
        comment: reviewDoc.comment,
        rating: reviewDoc.rating,
        createdAt: reviewDoc.createdAt
    };
}

router.post("/", wrapAsync(async (req, res) => {
    if (!req.body.review) {
        throw new ExpressError(400, "Review data is required!");
    }

    const listingId = req.params.id.trim();

    const newReview = new Review({
        comment: req.body.review.comment,
        rating: Number(req.body.review.rating)
    });

    await newReview.save();

    let listing = await Listing.findByIdAndUpdate(
        listingId,
        {
            $push: {
                reviews: newReview._id,
                reviewSnapshots: buildReviewSnapshot(newReview)
            }
        },
        { returnDocument: "after" }
    );

    if (listing) {
        return res.redirect(`/listings/${listing._id}`);
    }

    const fallbackReview = new FallbackReview({
        comment: req.body.review.comment,
        rating: Number(req.body.review.rating)
    });

    await fallbackReview.save();
    listing = await FallbackListing.findByIdAndUpdate(
        listingId,
        {
            $push: {
                reviews: fallbackReview._id,
                reviewSnapshots: buildReviewSnapshot(fallbackReview)
            }
        },
        { returnDocument: "after" }
    );

    if (!listing) {
        await Review.findByIdAndDelete(newReview._id);
        await FallbackReview.findByIdAndDelete(fallbackReview._id);
        throw new ExpressError(404, "Listing not found!");
    }

    await Review.findByIdAndDelete(newReview._id);

    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId,
            reviewSnapshots: { reviewId }
        }
    });

    if (listing) {
        await Review.findByIdAndDelete(reviewId);
        return res.redirect(`/listings/${id}`);
    }

    listing = await FallbackListing.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId,
            reviewSnapshots: { reviewId }
        }
    });

    if (listing) {
        await FallbackReview.findByIdAndDelete(reviewId);
        return res.redirect(`/listings/${id}`);
    }

    throw new ExpressError(404, "Listing not found!");
}));

module.exports = router;
