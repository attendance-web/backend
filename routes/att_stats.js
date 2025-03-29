const express = require('express');
const queryDb = require('../helper/query');
const verifyToken = require('../middleware/token');
const verifyApiKey = require('../middleware/api_key');
const randomString = require('randomstring');

const router = express.Router();

router.get('/attendance-stats', verifyApiKey, async (req, res) => {
    try {
        const sql = `
            SELECT DATE(datetime) AS date, COUNT(*) AS total_attendance
            FROM attendance
            WHERE attendance = 1
            GROUP BY DATE(datetime)
            ORDER BY date;
        `;

        const results = await queryDb(sql);
        res.json(results);
    } catch (err) {
        console.error("Error fetching attendance stats:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/', verifyApiKey, async (req, res) => {
    try {
        const sql = "SELECT * FROM att_stats";

        const result = await queryDb(sql);
        res.status(200).json(result);
    } catch (e) {
        console.error("Error fetching attendance:", e);
    }
});

router.patch('/toggle', verifyToken, async (req, res) => {
    try {
        const sql = "SELECT stats FROM att_stats LIMIT 1";
        const result = await queryDb(sql);
        const logId = randomString.generate(16).toUpperCase();
        const user_id = req.userId

        if (result.length === 0) {
            return res.status(404).json({ message: "Attendance status not found!" });
        }

        const currentStats = result[0].stats;
        const newStats = currentStats ? 0 : 1; 
        const sqlUpdate = "UPDATE att_stats SET stats = ?";
        
        await queryDb(sqlUpdate, [newStats]);
        await queryDb("INSERT INTO logs (id, user_id, activity) VALUES (?, ?, ?)", [logId, user_id, `Attendance status toggled into ${newStats === 1 ? 'Opened' : 'Closed'}`]);

        res.status(200).json({ message: "Attendance status updated!", newStats });
    } catch (err) {
        console.error("Error updating attendance status:", err.message);
        res.status(500).json({ message: "An error occurred!" });
    }
});

module.exports = router;