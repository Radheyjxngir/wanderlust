const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/dataji";

function uniqueObjectIds(ids = []) {
    const seen = new Set();
    const result = [];

    for (const id of ids) {
        const key = String(id);
        if (!seen.has(key)) {
            seen.add(key);
            result.push(id);
        }
    }

    return result;
}

function uniqueSnapshots(snapshots = []) {
    const seen = new Set();
    const result = [];

    for (const snapshot of snapshots) {
        const key = String(snapshot.reviewId || snapshot._id);
        if (!seen.has(key)) {
            seen.add(key);
            result.push(snapshot);
        }
    }

    return result;
}

async function main() {
    await mongoose.connect(MONGO_URL);

    const duplicates = await Listing.aggregate([
        {
            $group: {
                _id: {
                    title: "$title",
                    location: "$location",
                    country: "$country"
                },
                ids: { $push: "$_id" },
                count: { $sum: 1 }
            }
        },
        {
            $match: { count: { $gt: 1 } }
        }
    ]);

    for (const group of duplicates) {
        const listings = await Listing.find({ _id: { $in: group.ids } }).lean();
        const keeper = listings.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0))[0];
        const others = listings.filter((listing) => String(listing._id) !== String(keeper._id));

        const mergedReviews = uniqueObjectIds([
            ...(keeper.reviews || []),
            ...others.flatMap((listing) => listing.reviews || [])
        ]);

        const mergedSnapshots = uniqueSnapshots([
            ...(keeper.reviewSnapshots || []),
            ...others.flatMap((listing) => listing.reviewSnapshots || [])
        ]);

        await Listing.findByIdAndUpdate(keeper._id, {
            $set: {
                reviews: mergedReviews,
                reviewSnapshots: mergedSnapshots
            }
        });

        await Listing.deleteMany({
            _id: { $in: others.map((listing) => listing._id) }
        });

        console.log(`merged duplicates into listing ${keeper._id}`);
    }

    const orphanReviewIds = await Review.find({}, { _id: 1 }).lean();
    console.log(`reviews checked: ${orphanReviewIds.length}`);

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error("merge failed:", err);
    process.exit(1);
});
