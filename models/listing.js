const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60";

// इमेज डेटा ने सही फ़ॉर्मेट में लावण खातिर फ़ंक्शन
function normalizeImage(image) {
    if (typeof image === "string") {
        const trimmedImage = image.trim();
        return {
            filename: "listingimage",
            url: trimmedImage || DEFAULT_IMAGE_URL,
            publicId: null
        };
    }
    if (image && typeof image === "object") {
        return {
            filename: image.filename || "listingimage",
            url: image.url || DEFAULT_IMAGE_URL,
            publicId: image.publicId || null
        };
    }
    return {
        filename: "listingimage",
        url: DEFAULT_IMAGE_URL,
        publicId: null
    };
}

const imageSchema = new Schema({
    filename: { type: String, default: "listingimage" },
    url: { type: String, default: DEFAULT_IMAGE_URL },
    publicId: { type: String, default: null }
}, { _id: false });

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: imageSchema,
        default: () => ({
            filename: "listingimage",
            url: DEFAULT_IMAGE_URL,
            publicId: null
        }),
        set: normalizeImage
    },
    images: {
        type: [imageSchema],
        default: []
    },
    price: Number,
    location: String,
    country: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // 1. Reviews Array (पॉपुलेट करण खातिर)
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    // 2. Review Snapshots (डेटा स्टोर करण खातिर)
    reviewSnapshots: [
        {
            reviewId: {
                type: Schema.Types.ObjectId,
                ref: "Review"
            },
            authorName: String,
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
