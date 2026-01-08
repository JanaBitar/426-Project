const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// DB connectivity check
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows[0] });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Get all books
app.get("/api/books", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, Title, author, category, Price, image, description FROM books ORDER BY id"
    );

    res.json(
      rows.map((b) => ({
        id: b.id,
        title: b.Title,
        author: b.author,
        category: b.category,
        price: Number(b.Price),
        image: b.image || "",
        description: b.description || "",
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get book by id 
app.get("/api/books/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid book id" });
    }

    const [rows] = await db.query(
      "SELECT id, Title, author, category, Price, image, description FROM books WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    const b = rows[0];
    res.json({
      id: b.id,
      title: b.Title,
      author: b.author,
      category: b.category,
      price: Number(b.Price),
      image: b.image || "",
      description: b.description || "",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SIGNUP
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, phone_number } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password are required" });
    }

    // Check if email exists
    const [existing] = await db.query("SELECT ID FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, phone_number, password_hash) VALUES (?, ?, ?, ?)",
      [name, email, phone_number ?? null, password_hash]
    );

    res.status(201).json({ message: "User created", userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const [rows] = await db.query(
      "SELECT ID, name, email, password_hash FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const token = jwt.sign(
      { id: user.ID, email: user.email, name: user.name },
      secret,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login success",
      token,
      user: { id: user.ID, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ORDERS
 * Table columns:
 * ID (PK), `Customer ID`, `Date`, `Total`
 */

// Create an order
app.post("/api/orders", async (req, res) => {
  try {
    const { customerId, total } = req.body;

    if (!customerId || total === undefined) {
      return res.status(400).json({ error: "customerId and total are required" });
    }

    const custIdNum = Number(customerId);
    const totalNum = Number(total);

    if (!Number.isInteger(custIdNum) || custIdNum <= 0) {
      return res.status(400).json({ error: "Invalid customerId" });
    }
    if (Number.isNaN(totalNum) || totalNum < 0) {
      return res.status(400).json({ error: "Invalid total" });
    }

    const now = Date.now();

    const [result] = await db.query(
      "INSERT INTO orders (`Customer ID`, `Date`, `Total`) VALUES (?, ?, ?)",
      [custIdNum, now, totalNum]
    );

    res.status(201).json({
      message: "Order created",
      orderId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get orders by user/customer id
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const [rows] = await db.query(
      "SELECT `ID`, `Customer ID`, `Date`, `Total` FROM orders WHERE `Customer ID` = ? ORDER BY `ID` DESC",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
