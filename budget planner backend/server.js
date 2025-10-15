const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express(); // must be defined before routes
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Parse JSON
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "budget_planner_db"
});

db.connect(err => {
  if (err) console.error("MySQL connection error:", err);
  else console.log("MySQL connected...");
});

// --- Routes ---

// Register
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please fill all fields" });
  }
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User registered successfully", user: { name, email } });
  });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });
    res.json({ message: "Login successful", user: results[0] });
  });
});

// Get transactions
app.get("/api/transactions", (req, res) => {
  db.query("SELECT * FROM transactions", (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// Add transaction
app.post("/api/transactions", (req, res) => {
  const data = req.body;
  db.query("INSERT INTO transactions SET ?", data, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: "Transaction added", id: results.insertId });
  });
});

// Get users
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// Get categories
app.get("/api/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
