const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const profileRoutes = require('./routes/profile');
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

// const PORT = 9000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;