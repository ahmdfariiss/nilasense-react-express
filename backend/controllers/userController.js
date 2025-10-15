const db = require("../db");

// Fungsi untuk mendapatkan semua pengguna (Hanya Admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Query untuk mengambil data penting pengguna, diurutkan berdasarkan ID
    const users = await db.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id ASC"
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
    const { name, email, role } = req.body; // Data baru dari body request

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

    // Lakukan query UPDATE ke database
    const updatedUser = await db.query(
      "UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role",
      [newName, newEmail, newRole, id]
    );

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
