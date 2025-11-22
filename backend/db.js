const { Pool } = require("pg");
require("dotenv").config();

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
