const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const primaryUrl = "mongodb://127.0.0.1:27017/dataji";
const fallbackUrl = "mongodb://127.0.0.1:27017/wonderlust";

async function syncCollection(SourceModel, TargetModel) {
    const docs = await SourceModel.find({}).lean();

    for (const doc of docs) {
        await TargetModel.replaceOne({ _id: doc._id }, doc, { upsert: true });
    }
}

async function main() {
    const primaryConn = await mongoose.createConnection(primaryUrl).asPromise();
    const fallbackConn = await mongoose.createConnection(fallbackUrl).asPromise();

    const PrimaryListing = primaryConn.model("Listing", Listing.schema);
    const PrimaryReview = primaryConn.model("Review", Review.schema);
    const FallbackListing = fallbackConn.model("Listing", Listing.schema);
    const FallbackReview = fallbackConn.model("Review", Review.schema);

    await syncCollection(FallbackReview, PrimaryReview);
    await syncCollection(FallbackListing, PrimaryListing);

    console.log("wonderlust -> dataji sync complete");

    await primaryConn.close();
    await fallbackConn.close();
}

main().catch((err) => {
    console.error("sync failed:", err);
    process.exit(1);
});
