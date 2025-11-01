const db = require("../config/database");
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
