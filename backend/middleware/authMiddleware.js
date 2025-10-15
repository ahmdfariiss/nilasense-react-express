const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // 1. Cek apakah ada header Authorization dan formatnya benar ('Bearer <token>')
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Ambil token dari header
      token = req.headers.authorization.split(" ")[1];

      // 3. Verifikasi token menggunakan secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Jika berhasil, tambahkan data user (dari payload token) ke objek request
      // Kita tidak perlu query ke DB lagi karena data user sudah ada di token
      req.user = {
        id: decoded.id,
        name: decoded.name,
        role: decoded.role,
      };

      // 5. Lanjutkan ke fungsi controller selanjutnya
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Akses ditolak, token tidak valid" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Akses ditolak, tidak ada token" });
  }
};

const isAdmin = (req, res, next) => {
  // Middleware ini harus dijalankan SETELAH middleware 'protect'
  if (req.user && req.user.role === "admin") {
    next(); // Jika user ada dan perannya adalah 'admin', lanjutkan
  } else {
    // Kirim status 403 Forbidden jika bukan admin
    res
      .status(403)
      .json({ message: "Akses ditolak. Rute ini hanya untuk admin." });
  }
};

// Jangan lupa untuk mengekspor fungsi yang baru
module.exports = { protect, isAdmin };
