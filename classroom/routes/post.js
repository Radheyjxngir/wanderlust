const express = require("express");
const router = express.Router();


// 1. Index Route (सगळा यूज़र्स दिखाण खातर)
router.get("/", (req, res) => {
   res.send("सगळा यूज़र्स की लिस्ट अठे दिखेगी।");
});

// 2. Show Route (ID के हिसाब स्यूँ एक यूज़र)
router.get("/:id", (req, res) => {
   let { id } = req.params;
   res.send(`यूज़र की जानकारी: ID ${id}`);
});

// 3. Post Route (नयो यूज़र बणाण खातर)
router.post("/", (req, res) => {
     res.send("नयो यूज़र बण गयो है।");
});

// 4. Delete Route (यूज़र हटाण खातर)
router.delete("/:id", (req, res) => {
    res.send("यूज़र डिलीट कर दियो गयो है।");
});

module.exports = router;