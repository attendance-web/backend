const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, conn) => {
    if (err) {
        return console.error("Error connecting to db " + err.message);
    }

    console.log("Connected to db");
    conn.release();
});

module.exports = pool;