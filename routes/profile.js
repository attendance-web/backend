const express = require('express');
const queryDb = require('../helper/query');
const verifyToken = require('../middleware/token');
require('dotenv').config();

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    const userId = req.userId;
    try {
        const sql = 'SELECT fullname, email, role FROM users WHERE id = ?';
        const result = await queryDb(sql, [userId]);

        res.status(200).json(result);
    } catch (e) {
        console.log(e);
        res.status(501).json({ message: {
            error: "An error occurred"
        } });
    }
});

module.exports = router;