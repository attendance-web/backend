const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');
const queryDb = require('../helper/query');
const verifyToken = require('../middleware/token');
const verifyApiKey = require('../middleware/api_key');
const verifyAdmin = require('../middleware/admin');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    const { fullname, email, password, birthday } = req.body;

    if (!email || !password || !birthday || !fullname) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user_id = randomString.generate(16).toUpperCase();
        const logId = randomString.generate(16).toUpperCase();

        const checkUser = "SELECT * FROM users WHERE email = ?"
        const result = await queryDb(checkUser, [email]);

        if(result.length > 0) {
            if (result[0].email === email) {
                return res.status(400).json({ message: "Email already exist" });
            }
        }

        const sql =  "INSERT INTO users (id, fullname, email, password, birth_day) VALUES (?, ?, ?, ?, ?)";
        await queryDb(sql, [user_id, fullname, email, hashedPassword, birthday]);
        await queryDb("INSERT INTO logs (id, user_id, activity) VALUES (?, ?, ?)", [logId, user_id, "Registered"]);
        res.status(200).json({ message: "Registration successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred!", error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill email and password" });
    }

    try {
        const sql = "SELECT * FROM users WHERE email = ?";
        const result = await queryDb(sql, [email]);
        const logId = randomString.generate(16).toUpperCase();

        if (result.length === 0) {
            return res.status(400).json({ message: "Email not found" });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        await queryDb("INSERT INTO logs (id, user_id, activity) VALUES (?, ?, ?)", [logId, user.id, "Logged in"]);

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const sessionSql = `
            INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at)
            VALUES (?, ?, ?, ?, NOW() + INTERVAL 1 HOUR)
        `;
        await queryDb(sessionSql, [user.id, token, ipAddress, userAgent]);

        res.json({
            message: "Login successful",
            userId: user.id,
            token,
        });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post('/logout', verifyToken, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const userId = req.userId;
    const logId = randomString.generate(16).toUpperCase();

    if (!token) {
        return res.status(400).json({ message: "Token is required!" });
    }

    try {
        await queryDb("DELETE FROM sessions WHERE token = ?", [token]);
        await queryDb("INSERT INTO logs (id, user_id, activity) VALUES (?, ?, ?)", [logId, userId, "Logout"]);
        res.json({ message: "Logout successful" });
    } catch (err) {
        console.error("Error during logout:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;