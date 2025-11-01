// Load environment variables
require("dotenv").config();

// Import Express app
const app = require("./src/app");

// Ganti port kembali ke 5001 jika perlu
const PORT = process.env.PORT || 5001;

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
