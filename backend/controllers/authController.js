const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Fungsi untuk register user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validasi input dasar
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Nama, email, dan password harus diisi" });
  }

  try {
    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Simpan user baru ke database
    const newUser = await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'buyer') RETURNING id, name, email, role",
      [name, email, passwordHash]
    );

    res.status(201).json({
      message: "User berhasil terdaftar",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    // Cek jika email sudah terdaftar
    if (error.code === "23505") {
      // Kode error unik untuk duplikasi
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }

  try {
    // 2. Cari pengguna berdasarkan email di database
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // Jika user tidak ditemukan
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Kredensial tidak valid" }); // Pesan generik untuk keamanan
    }

    const user = userResult.rows[0];

    // 3. Bandingkan password yang diinput dengan hash di database
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Kredensial tidak valid" });
    }

    // 4. Jika password cocok, buat payload untuk token
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
      pond_id: user.pond_id || null, // Include pond assignment for petambak
    };

    // 5. Buat dan tandatangani token JWT
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token akan valid selama 1 hari
    );

    // 6. Kirim token dan data user kembali ke client
    res.status(200).json({
      message: "Login berhasil",
      token,
      user: payload,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.getMe = async (req, res) => {
  // Data 'req.user' sudah ditambahkan oleh middleware 'protect'
  res.status(200).json(req.user);
};

// Fungsi untuk lupa password - kirim email reset
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email harus diisi" });
  }

  try {
    // Cari user berdasarkan email
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // Untuk keamanan, selalu return success meskipun email tidak ditemukan
    // Ini mencegah email enumeration attack
    if (userResult.rows.length === 0) {
      return res.status(200).json({
        message:
          "Jika email terdaftar, instruksi reset password telah dikirim ke email Anda.",
      });
    }

    const user = userResult.rows[0];

    // Generate token reset password
    const crypto = require("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token sebelum disimpan ke database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token kadaluarsa dalam 1 jam
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Hapus token reset password lama yang belum digunakan (jika tabel ada)
    try {
      await db.query(
        "DELETE FROM password_reset_tokens WHERE user_id = $1 AND used = FALSE",
        [user.id]
      );
    } catch (deleteError) {
      // Jika tabel belum ada, buat tabel terlebih dahulu
      if (deleteError.code === "42P01") {
        console.log(
          "⚠️  Tabel password_reset_tokens belum ada, membuat tabel..."
        );
        await db.query(`
          CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMPTZ NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token);
          CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_tokens(user_id);
          CREATE INDEX IF NOT EXISTS idx_password_reset_expires ON password_reset_tokens(expires_at);
        `);
      } else {
        throw deleteError;
      }
    }

    // Simpan token baru ke database
    await db.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, hashedToken, expiresAt]
    );

    // Kirim email reset password
    const emailService = require("../services/emailService");
    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        resetToken, // Kirim token yang belum di-hash
        user.name
      );

      res.status(200).json({
        message:
          "Jika email terdaftar, instruksi reset password telah dikirim ke email Anda.",
      });
    } catch (emailError) {
      console.error("Error mengirim email:", emailError);
      // Tetap return success untuk keamanan, tapi log error
      res.status(200).json({
        message:
          "Jika email terdaftar, instruksi reset password telah dikirim ke email Anda.",
        // Note: Dalam production, mungkin perlu handle error email dengan lebih baik
      });
    }
  } catch (error) {
    console.error("Error forgot password:", error);

    // Berikan error message yang lebih informatif
    let errorMessage = "Terjadi kesalahan pada server";

    // Jika error karena tabel tidak ada
    if (error.code === "42P01") {
      errorMessage =
        "Tabel password reset belum tersedia. Silakan jalankan migration database.";
      console.error(
        "⚠️  Migration belum dijalankan. Jalankan: psql -U postgres -d nilasense_db -f database/migrations/008_add_password_reset.sql"
      );
    }

    res.status(500).json({
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Fungsi untuk reset password dengan token
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token dan password baru harus diisi" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password minimal 6 karakter" });
  }

  try {
    // Hash token untuk dicocokkan dengan database
    const crypto = require("crypto");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Pastikan tabel ada
    try {
      await db.query("SELECT 1 FROM password_reset_tokens LIMIT 1");
    } catch (tableError) {
      if (tableError.code === "42P01") {
        return res.status(400).json({
          message:
            "Tabel password reset belum tersedia. Silakan jalankan migration database terlebih dahulu.",
        });
      }
      throw tableError;
    }

    // Cari token di database
    const tokenResult = await db.query(
      "SELECT * FROM password_reset_tokens WHERE token = $1 AND used = FALSE AND expires_at > NOW()",
      [hashedToken]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        message:
          "Token tidak valid atau sudah kadaluarsa. Silakan request reset password lagi.",
      });
    }

    const resetToken = tokenResult.rows[0];

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password user
    await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      passwordHash,
      resetToken.user_id,
    ]);

    // Mark token sebagai sudah digunakan
    await db.query(
      "UPDATE password_reset_tokens SET used = TRUE WHERE id = $1",
      [resetToken.id]
    );

    res.status(200).json({
      message: "Password berhasil direset. Silakan login dengan password baru.",
    });
  } catch (error) {
    console.error("Error reset password:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
