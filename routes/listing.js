const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
 
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js"); // अब ओ सिर्फ एक बार ही है
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { FALLBACK_MONGO_URL } = require("../config/db.js");

const fallbackConnection = mongoose.createConnection(FALLBACK_MONGO_URL);
const FallbackListing = fallbackConnection.model("Listing", Listing.schema);
const FallbackReview = fallbackConnection.model("Review", Review.schema);

// --- 1. validateListing मिडलवेयर ---
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

function normalizeListingData(listing = {}) {
    const imageValue = typeof listing.image === "string" ? listing.image.trim() : "";

    return {
        ...listing,
        image: {
            filename: "listingimage",
            url: imageValue || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60"
        }
    };
}

async function findListingById(id) {
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        options: { sort: { createdAt: -1 } }
    });

    if (listing) {
        return { listing, source: "primary" };
    }

    listing = await FallbackListing.findById(id).populate({
        path: "reviews",
        model: FallbackReview,
        options: { sort: { createdAt: -1 } }
    });

    if (listing) {
        return { listing, source: "fallback" };
    }

    return { listing: null, source: null };
}

// --- ROUTES ---

// INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});

    if (allListings.length === 0) {
        allListings = await FallbackListing.find({});
    }

    res.render("listings/index.ejs", { allListings });
}));

// NEW ROUTE
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// CREATE ROUTE
router.post("/", 
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(normalizeListingData(req.body.listing));
        await newListing.save();
        req.flash("success", "New listing created!"); 
        res.redirect("/listings"); 
    })
);

// SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { listing } = await findListingById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}));

// EDIT ROUTE
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { listing } = await findListingById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
}));

// UPDATE ROUTE
router.put("/:id", 
    validateListing, 
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, normalizeListingData(req.body.listing));
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    })
);

// DELETE ROUTE
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
    
}));

module.exports = router;
