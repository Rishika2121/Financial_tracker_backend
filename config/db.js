const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@123",   // MUST be string
  database: "expense_tax_db",
  port: 3306
});

module.exports = db;
