const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const pool = mysql.createPool({
  host     : process.env.DB_HOST || "34.64.210.53",
  user     : process.env.DB_USER,
  password : process.env.DB_PWD,
  database : process.env.DB_NAME,
  dateStrings: 'date',
  charset: 'utf8mb4',
});

module.exports = pool;
