const mongoose = require("mongoose");

const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60";

function normalizeImage(image) {
    if (typeof image === "string") {
        const trimmedImage = image.trim();

        return {
            filename: "listingimage",
            url: trimmedImage || DEFAULT_IMAGE_URL
        };
    }

    if (image && typeof image === "object") {
        return {
            filename: image.filename || "listingimage",
            url: image.url || DEFAULT_IMAGE_URL
        };
    }

    return {
        filename: "listingimage",
        url: DEFAULT_IMAGE_URL
    };
}

const imageSchema = new mongoose.Schema({
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: DEFAULT_IMAGE_URL
    }
}, { _id: false });

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: {
        type: imageSchema,
        default: () => ({
            filename: "listingimage",
            url: DEFAULT_IMAGE_URL
        }),
        set: normalizeImage
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    reviewSnapshots: [
        {
            reviewId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review"
            },
            comment: String,
            rating: Number,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
