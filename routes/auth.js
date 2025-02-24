const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');
const queryDb = require('../helper/query');
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
        const user_id = randomString.generate(16);

        const checkUser = "SELECT * FROM users WHERE email = ?"
        const result = await queryDb(checkUser, [email]);

        if(result.length > 0) {
            if (result[0].email === email) {
                return res.status(400).json({ message: "Email already exist" });
            }
        }

        const sql =  "INSERT INTO users (id, fullname, email, password, birth_day) VALUES (?, ?, ?, ?, ?)";
        await queryDb(sql, [user_id, fullname, email, hashedPassword, birthday]);
        res.status(200).json({ message: "Registration successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred!", error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill email and password" });
    }

    try {
        const sql = "SELECT * FROM users WHERE email = ?";
        const result = await queryDb(sql, [email]);

        if (result.length === 0) {
            return res.status(400).json({ message: "Email not found" });
        }
        
        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

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

module.exports = router;