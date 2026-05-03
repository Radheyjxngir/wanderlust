const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { MONGO_URL } = require("../config/db.js");

main()
  .then(() => {
    console.log("connected to DB");
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

function normalizeSeedListing(listing = {}) {
  const imageValue =
    typeof listing.image === "string"
      ? listing.image.trim()
      : listing.image && typeof listing.image === "object"
        ? String(listing.image.url || "").trim()
        : "";

  return {
    ...listing,
    image: {
      filename: "listingimage",
      url:
        imageValue ||
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60",
    },
  };
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    const normalizedData = initData.data.map(normalizeSeedListing);
    await Listing.insertMany(normalizedData);
    console.log("data was initialized");
  } catch (err) {
    console.log("Initialization Error:", err);
  }
};
