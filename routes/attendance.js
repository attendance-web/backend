const express = require('express');
const queryDb = require('../helper/query');
const verifyToken = require('../middleware/token');
const verifyApiKey = require('../middleware/api_key');
const randomstring = require('randomstring');

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    const { attendance } = req.body;
    const userId = req.userId;
    const attendanceId = randomstring.generate(16);

    try {
        const sql = "INSERT INTO attendance (id, user_id, attendance) VALUES (?, ?, ?)";

        await queryDb(sql, [attendanceId, userId, attendance]);
        
        return res.status(201).json({ message: "Attendance submitted!" });
    } catch (e) {
        console.error("Error during submit", e.message);

        res.status(500).json({ message: {
            error: "An error occurred!"
        } });
    }
});

router.get('/', verifyApiKey, async (req, res) => {
    try {
        const sql = "SELECT users.id AS user_id, users.fullname, users.email, users.role, attendance.id AS attendance_id, attendance.attendance, attendance.datetime FROM attendance JOIN users ON attendance.user_id = users.id WHERE attendance.user_id = users.id";
        const attendance = await queryDb(sql);

        res.status(200).json(attendance);
    } catch (e) {
        console.error("Error fetching attendance:", e.message);
        res.status(500).json({ message: {
            error: "An error occurred"
        } });
    }
});

module.exports = router;