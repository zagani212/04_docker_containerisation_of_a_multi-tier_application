import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER = "app",
  DB_PASSWORD = "app",
  DB_NAME = "appdb",
  PORT = "3000",
} = process.env;

let pool;

async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

app.get("/health", async (_req, res) => {
  try {
    const p = await getPool();
    await p.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(503).json({
      status: "degraded",
      database: "disconnected",
      message: err.message,
    });
  }
});

app.get("/messages", async (_req, res) => {
  try {
    const p = await getPool();
    const [rows] = await p.query(
      "SELECT id, body, created_at FROM messages ORDER BY id DESC LIMIT 50"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/messages", async (req, res) => {
  const body = typeof req.body?.body === "string" ? req.body.body.trim() : "";
  if (!body) {
    return res.status(400).json({ error: "body is required" });
  }
  try {
    const p = await getPool();
    const [result] = await p.query(
      "INSERT INTO messages (body) VALUES (?)",
      [body]
    );
    res.status(201).json({ id: result.insertId, body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`API listening on ${PORT}`);
});
