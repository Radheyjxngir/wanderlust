const express = require('express');
const router = express.Router();

// 1. Index Route - /users पर ई सारा यूज़र्स देखण तांई
router.get("/", (req, res) => {
    res.send("GET request: सारा यूज़र्स री लिस्ट अठै दिखेगी");
});

// 2. Show Route - /users/:id तांई
router.get("/:id", (req, res) => {
    let { id } = req.params;
    res.send(`GET request: यूज़र ID ${id} री जानकारी`);
});

// 3. Post Route - /users पर नयो यूज़र बणावण तांई
router.post("/", (req, res) => {
    res.send("POST request: नयो यूज़र बण गयो है");
});

// 4. Delete Route - /users/:id डिलीट करण तांई
router.delete("/:id", (req, res) => {
    let { id } = req.params;
    res.send(`DELETE request: यूज़र ID ${id} ने डिलीट कर दियो है`);
});

module.exports = router;