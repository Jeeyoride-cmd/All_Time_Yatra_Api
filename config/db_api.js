const mysql = require("mysql2/promise");

// dotenv only needed for local development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS, // ✅ fixed
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
