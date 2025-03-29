const express = require('express');
const verifyApiKey = require('../middleware/api_key');
const queryDb = require('../helper/query');
const router = express.Router();

router.get('/', verifyApiKey, async (req, res) => {
    try {
        const result = await queryDb("SELECT logs.id, users.fullname, logs.activity, logs.timestamp FROM logs JOIN users ON logs.user_id = users.id ORDER BY logs.timestamp DESC");

       res.status(200).json(result); 
    } catch (e) {
        res.status(500).json({ message: {
            error: "An error occurred!"
        } });
    }
});

module.exports = router;