require('dotenv').config();

function verifyApiKey(req, res, next) {
    const validApiKey = process.env.API_KEY
    const apiKey = req.query.KEY;
    if (!apiKey) return res.status(401).json({ message: {
        error: "Api key is missing"
    } });

    if (!validApiKey) return res.status(403).json({ message: {
        error: "Invalid api key"
    } });

    next();

}

module.exports = verifyApiKey;