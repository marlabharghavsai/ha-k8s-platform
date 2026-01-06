const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

/**
 * PostgreSQL connection pool
 * Pool is REQUIRED for production workloads
 */
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "postgres",
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

/**
 * Initialize DB schema safely
 */
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS healthcheck (
        id SERIAL PRIMARY KEY,
        checked_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database init failed:", err.message);
  }
}

// Initialize DB once at startup
initDB();

/**
 * Root endpoint
 */
app.get("/", (req, res) => {
  res.send("HA Platform Running");
});

/**
 * Liveness probe
 * DOES NOT depend on DB
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/**
 * Readiness + DB health endpoint
 * Kubernetes-friendly
 */
app.get("/db-health", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO healthcheck DEFAULT VALUES RETURNING id"
    );
    res.status(200).send(`DB OK, row=${result.rows[0].id}`);
  } catch (err) {
    console.error("DB health check failed:", err.message);
    res.status(503).send("DB DOWN");
  }
});

/**
 * Graceful shutdown (important for Kubernetes)
 */
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await pool.end();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
