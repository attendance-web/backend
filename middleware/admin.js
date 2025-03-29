const queryDb = require('../helper/query');

const verifyAdmin = async (req, res, next) => {
    const userId = req.userId;

    try {
        const sql = "SELECT role FROM users WHERE id = ?";
        const [user] = await queryDb(sql, [userId]);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied! Admin only." });
        }

        next();
    } catch (err) {
        console.error("Error verifying admin:", err.message);
        res.status(500).json({ message: "An error occurred!" });
    }
};

module.exports = verifyAdmin;