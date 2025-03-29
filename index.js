const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const profileRoutes = require('./routes/profile');
const attStatsRoutes = require('./routes/att_stats');
const userRoutes = require('./routes/user');
const logsRoutes = require('./routes/logs');
const randomString = require('randomstring');

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));

app.use(bodyParser.json());

app.get('/', (req, res) => res.send("Server is running!"));

app.use('/auth', authRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/profile', profileRoutes);
app.use('/att-stats', attStatsRoutes);
app.use('/user', userRoutes);
app.use('/logs', logsRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// module.exports = app;