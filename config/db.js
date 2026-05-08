const DB_NAME = process.env.DB_NAME || "dataji";
const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://radheyshyamjangir:IWIxP8HSSM1nvtx5@radhey.vzezinc.mongodb.net/?appName=radhey";
const FALLBACK_DB_NAME = DB_NAME === "dataji" ? "wonderlust" : "dataji";
const FALLBACK_MONGO_URL = `mongodb://127.0.0.1:27017/${FALLBACK_DB_NAME}`;

module.exports = {
    DB_NAME,
    MONGO_URL,
    FALLBACK_DB_NAME,
    FALLBACK_MONGO_URL
};
