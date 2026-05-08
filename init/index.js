const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { MONGO_URL } = require("../config/db.js");

// DB Connection
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

// इमेज ने सही फ़ॉर्मेट में लावण खातिर फ़ंक्शन
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
    images: [
      {
        filename: "listingimage",
        url:
          imageValue ||
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60",
      },
    ],
  };
}

// डेटाबेस साफ़ कर'र नयो डेटा नाखण खातिर
const initDB = async () => {
  try {
    // 1. पैलां पुरानो डेटा हटाओ
    await Listing.deleteMany({});

    // 2. डेटा ने मैप (map) करो ताकी owner और सही image सेट हो जावे
    const normalizedData = initData.data.map((obj) => {
      // पैलां इमेज सही करो
      let cleanObj = normalizeSeedListing(obj);
      
      // फेर owner जोड़ो (थारी 'radheyshyam' आळी ID)
      return {
        ...cleanObj,
        owner: "69f6d3a927793ddb533b755d", 
      };
    });

    // 3. अब यो सबरूपूं सही डेटा insert करो
    await Listing.insertMany(normalizedData);
    
    console.log("Data was initialized: Images fixed and Owner added!");
  } catch (err) {
    console.log("Initialization Error:", err);
  }
};
