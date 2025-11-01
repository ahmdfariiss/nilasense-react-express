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
        pond_id: decoded.pond_id || null, // For petambak users
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

const isPetambak = (req, res, next) => {
  // Middleware untuk petambak role
  if (req.user && req.user.role === "petambak") {
    // Pastikan petambak punya pond_id assignment
    if (!req.user.pond_id) {
      return res
        .status(403)
        .json({ message: "Akses ditolak. Petambak belum di-assign ke kolam." });
    }
    next();
  } else {
    res
      .status(403)
      .json({ message: "Akses ditolak. Rute ini hanya untuk petambak." });
  }
};

const isAdminOrPetambak = (req, res, next) => {
  // Middleware untuk admin atau petambak
  // Digunakan untuk halaman yang bisa diakses kedua role
  if (req.user && (req.user.role === "admin" || req.user.role === "petambak")) {
    // Untuk petambak, pastikan punya pond assignment
    if (req.user.role === "petambak" && !req.user.pond_id) {
      return res
        .status(403)
        .json({ message: "Akses ditolak. Petambak belum di-assign ke kolam." });
    }
    next();
  } else {
    res
      .status(403)
      .json({
        message: "Akses ditolak. Rute ini hanya untuk admin atau petambak.",
      });
  }
};

// Jangan lupa untuk mengekspor fungsi yang baru
module.exports = { protect, isAdmin, isPetambak, isAdminOrPetambak };
