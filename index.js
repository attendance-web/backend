const express = require('express');
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const authRoutes = require('./routes/auth');
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send("Server is running!"));

app.use('/auth', authRoutes);

const PORT = 9000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));