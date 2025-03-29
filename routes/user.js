const express = require('express');
const queryDb = require('../helper/query');
const verifyApiKey = require('../middleware/api_key');
const verifyAdmin = require('../middleware/admin');
const verifyToken = require('../middleware/token');
const randomString = require('randomstring');
require('dotenv').config();

const router = express.Router();

router.get('/', verifyApiKey, async (req, res) => {
    const sql = 'SELECT * FROM users';
    
    try {
        const result = await queryDb(sql);
        res.status(200).json(result);
        console.log(result.map((res) => res.fullname));
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred!' });
    }
});

router.patch('/:id/role', verifyToken, async (req, res) => {
    const id = req.params.id;
    const { role } = req.body;
    const logId = randomString.generate(16).toUpperCase();

    try {
        const sql = "UPDATE users SET role = ? WHERE id = ?";
        const results = await queryDb(sql, [role, id]);
        await queryDb("INSERT INTO logs (id, user_id, activity) VALUES (?, ?, ?)", [logId, id, `Role changed to ${role}`]);
        console.log(results);
        res.status(201).json({ message: 'Role updated successfully!' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred!' });
    }
});

router.get('/active-users', verifyApiKey, async (req, res) => {
    try {
        const sql = `
            SELECT DISTINCT users.id, users.fullname, users.email
            FROM sessions
            JOIN users ON sessions.user_id = users.id
            WHERE sessions.expires_at > NOW()
        `;
        const activeUsers = await queryDb(sql);

        res.status(200).json(activeUsers);
    } catch (err) {
        console.error("Error fetching active users:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/active-admin', verifyApiKey, async (req, res) => {
    try {
        const sql = `
        SELECT DISTINCT users.id, users.fullname, users.email
        FROM sessions
        JOIN users ON sessions.user_id = users.id
        WHERE sessions.expires_at > NOW() AND users.role = 'admin'
        `;

        const activeAdmins = await queryDb(sql);
        
        res.status(200).json(activeAdmins);
    } catch (e) {
        console.error("Error fetching active admin:", e.message);
        res.status(500).json({ message: "Server error", error: e.message });
    }
});

module.exports = router;