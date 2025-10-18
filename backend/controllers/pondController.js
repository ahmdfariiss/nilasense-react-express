// backend/controllers/pondController.js
const db = require("../db");

// Fungsi untuk mendapatkan semua kolam (Admin Only)
exports.getAllPonds = async (req, res) => {
  try {
    // Kita hanya akan mengambil kolam milik admin yang sedang login
    const adminUserId = req.user.id;

    const ponds = await db.query(
      "SELECT * FROM ponds WHERE user_id = $1 ORDER BY created_at DESC",
      [adminUserId]
    );

    res.status(200).json(ponds.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.createPond = async (req, res) => {
  const adminUserId = req.user.id; // Ambil ID admin dari token
  const { name, location } = req.body;

  // Validasi input
  if (!name) {
    return res.status(400).json({ message: "Nama kolam harus diisi" });
  }

  try {
    const newPond = await db.query(
      "INSERT INTO ponds (user_id, name, location) VALUES ($1, $2, $3) RETURNING *",
      [adminUserId, name, location]
    );

    res.status(201).json({
      message: "Kolam baru berhasil ditambahkan",
      pond: newPond.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.updatePond = async (req, res) => {
  try {
    const { id } = req.params; // ID kolam yang akan diupdate
    const { name, location } = req.body;
    const adminUserId = req.user.id;

    // Cek dulu apakah kolamnya ada dan milik admin yang benar
    const pondExist = await db.query(
      "SELECT * FROM ponds WHERE id = $1 AND user_id = $2",
      [id, adminUserId]
    );

    if (pondExist.rows.length === 0) {
      return res.status(404).json({
        message: "Kolam tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    const currentPond = pondExist.rows[0];

    // Gunakan data baru jika ada, jika tidak, gunakan data lama
    const newName = name || currentPond.name;
    const newLocation = location || currentPond.location;

    const updatedPond = await db.query(
      "UPDATE ponds SET name = $1, location = $2 WHERE id = $3 RETURNING *",
      [newName, newLocation, id]
    );

    res.status(200).json({
      message: "Data kolam berhasil diperbarui",
      pond: updatedPond.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.deletePond = async (req, res) => {
  try {
    const { id } = req.params; // ID kolam yang akan dihapus
    const adminUserId = req.user.id;

    // Cek dulu apakah kolamnya ada dan milik admin yang benar
    const pondExist = await db.query(
      "SELECT * FROM ponds WHERE id = $1 AND user_id = $2",
      [id, adminUserId]
    );

    if (pondExist.rows.length === 0) {
      return res
        .status(404)
        .json({
          message: "Kolam tidak ditemukan atau Anda tidak memiliki akses",
        });
    }

    // Lakukan query DELETE
    await db.query("DELETE FROM ponds WHERE id = $1", [id]);

    res.status(200).json({ message: `Kolam dengan ID ${id} berhasil dihapus` });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
