const { Pool } = require("pg");

// Hanya load dotenv di development (file .env lokal)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Debug: log environment variables (hide password)
console.log("🔧 DB Config:", {
  hasDbUrl: !!process.env.DATABASE_URL,
  host: process.env.DB_HOST || "(from DATABASE_URL)",
  user: process.env.DB_USER || "(from DATABASE_URL)",
  database: process.env.DB_DATABASE || "(from DATABASE_URL)",
  port: process.env.DB_PORT || "(from DATABASE_URL)",
  nodeEnv: process.env.NODE_ENV,
});

// Konfigurasi database
const isProduction = process.env.NODE_ENV === "production";

// Gunakan DATABASE_URL jika ada, atau individual env vars
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool(connectionConfig);

// Test connection on startup
pool.query("SELECT NOW()")
  .then((res) => console.log("✅ Database connected successfully at", res.rows[0].now))
  .catch((err) => console.error("❌ Database connection error:", err.message));

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool, // Export pool for transactions
};
