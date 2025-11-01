const db = require("../config/database");

// Fungsi untuk mendapatkan semua pengguna (Hanya Admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Query untuk mengambil data penting pengguna, diurutkan berdasarkan ID
    const users = await db.query(
      "SELECT id, name, email, role, pond_id, created_at FROM users ORDER BY id ASC"
    );

    // Kirim data pengguna sebagai respons
    res.status(200).json(users.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk mendapatkan satu pengguna berdasarkan ID (Admin only)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Mengambil ID dari parameter URL (misal: /api/users/2)

    const user = await db.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [id]
    );

    // Cek jika pengguna dengan ID tersebut ditemukan
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    // Kirim data pengguna yang ditemukan
    res.status(200).json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // ID pengguna yang akan diupdate
    const { name, email, role, password, pond_id } = req.body; // Data baru dari body request

    // Cek apakah pengguna ada
    const userExist = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userExist.rows.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    // Ambil data pengguna saat ini
    const currentUser = userExist.rows[0];

    // Gunakan data baru jika ada, jika tidak, gunakan data lama
    const newName = name || currentUser.name;
    const newEmail = email || currentUser.email;
    const newRole = role || currentUser.role;
    const newPondId = pond_id !== undefined ? pond_id : currentUser.pond_id;

    // Validasi pond_id for petambak
    if (newRole === "petambak" && !newPondId) {
      return res.status(400).json({
        message: "Petambak harus di-assign ke kolam",
      });
    }

    // Validate pond exists if pond_id provided
    if (newPondId) {
      const pondExist = await db.query("SELECT * FROM ponds WHERE id = $1", [
        newPondId,
      ]);
      if (pondExist.rows.length === 0) {
        return res.status(400).json({ message: "Kolam tidak ditemukan" });
      }
    }

    // Jika password diisi, hash password baru
    let updatedUser;
    if (password && password.trim().length > 0) {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);

      updatedUser = await db.query(
        "UPDATE users SET name = $1, email = $2, role = $3, password_hash = $4, pond_id = $5 WHERE id = $6 RETURNING id, name, email, role, pond_id, created_at",
        [newName, newEmail, newRole, hashedPassword, newPondId, id]
      );
    } else {
      // Jika password tidak diisi, update tanpa mengubah password
      updatedUser = await db.query(
        "UPDATE users SET name = $1, email = $2, role = $3, pond_id = $4 WHERE id = $5 RETURNING id, name, email, role, pond_id, created_at",
        [newName, newEmail, newRole, newPondId, id]
      );
    }

    res.status(200).json({
      message: "Data pengguna berhasil diperbarui",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    // Cek jika email duplikat
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ message: "Email sudah digunakan oleh pengguna lain." });
    }
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk membuat user baru (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, pond_id } = req.body;

    // Validasi input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Semua field (name, email, password, role) harus diisi",
      });
    }

    // Validasi role
    if (!["admin", "buyer", "petambak"].includes(role)) {
      return res.status(400).json({
        message: "Role harus 'admin', 'buyer', atau 'petambak'",
      });
    }

    // Validasi pond_id for petambak
    if (role === "petambak" && !pond_id) {
      return res.status(400).json({
        message: "Petambak harus di-assign ke kolam",
      });
    }

    // Validate pond exists if pond_id provided
    if (pond_id) {
      const pondExist = await db.query("SELECT * FROM ponds WHERE id = $1", [
        pond_id,
      ]);
      if (pondExist.rows.length === 0) {
        return res.status(400).json({ message: "Kolam tidak ditemukan" });
      }
    }

    // Cek apakah email sudah digunakan
    const emailExist = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (emailExist.rows.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    // Hash password
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    const newUser = await db.query(
      "INSERT INTO users (name, email, password_hash, role, pond_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, pond_id, created_at",
      [name, email, hashedPassword, role, pond_id || null]
    );

    res.status(201).json({
      message: "User berhasil dibuat",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error(error.message);

    // Cek jika email duplikat (safeguard)
    if (error.code === "23505") {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah pengguna ada sebelum menghapus
    const userExist = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userExist.rows.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    // Lakukan query DELETE
    await db.query("DELETE FROM users WHERE id = $1", [id]);

    res
      .status(200)
      .json({ message: `Pengguna dengan ID ${id} berhasil dihapus` });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
