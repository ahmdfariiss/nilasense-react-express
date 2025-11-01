// backend/controllers/pondController.js
const db = require("../config/database");

// Fungsi untuk mendapatkan semua kolam (Admin & Petambak)
exports.getAllPonds = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;

    let ponds;

    if (userRole === "admin") {
      // Admin bisa lihat semua kolam miliknya
      ponds = await db.query(
        "SELECT * FROM ponds WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
    } else if (userRole === "petambak") {
      // Petambak hanya bisa lihat kolam yang di-assign
      if (!userPondId) {
        return res
          .status(403)
          .json({ message: "Petambak belum di-assign ke kolam" });
      }
      ponds = await db.query("SELECT * FROM ponds WHERE id = $1", [userPondId]);
    } else {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    res.status(200).json(ponds.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk mendapatkan kolam yang bisa diakses user (Buyer, Admin & Petambak)
exports.getAccessiblePonds = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;

    let ponds;

    if (userRole === "admin") {
      // Admin hanya bisa lihat kolam miliknya sendiri
      ponds = await db.query(
        "SELECT * FROM ponds WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
    } else if (userRole === "petambak") {
      // Petambak hanya bisa lihat kolam yang di-assign
      if (!userPondId) {
        return res.status(403).json({
          message: "Petambak belum di-assign ke kolam",
        });
      }
      ponds = await db.query("SELECT * FROM ponds WHERE id = $1", [userPondId]);
    } else {
      // Buyer bisa lihat semua kolam (untuk demo purposes)
      // Dalam implementasi nyata, mungkin perlu relasi user-pond yang lebih kompleks
      ponds = await db.query("SELECT * FROM ponds ORDER BY created_at DESC");
    }

    res.status(200).json(ponds.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk mendapatkan satu kolam berdasarkan ID (Admin Only)
exports.getPondById = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUserId = req.user.id;

    // Cek apakah kolam ada dan milik admin yang benar
    const pond = await db.query(
      "SELECT * FROM ponds WHERE id = $1 AND user_id = $2",
      [id, adminUserId]
    );

    if (pond.rows.length === 0) {
      return res.status(404).json({
        message: "Kolam tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    res.status(200).json(pond.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.createPond = async (req, res) => {
  const adminUserId = req.user.id; // Ambil ID admin dari token
  const { name, location, description } = req.body;

  // Validasi input
  if (!name) {
    return res.status(400).json({ message: "Nama kolam harus diisi" });
  }

  try {
    const newPond = await db.query(
      "INSERT INTO ponds (user_id, name, location, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [adminUserId, name, location, description || null]
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
    const { name, location, description } = req.body;
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
    const newName = name !== undefined ? name : currentPond.name;
    const newLocation =
      location !== undefined ? location : currentPond.location;
    const newDescription =
      description !== undefined ? description : currentPond.description;

    const updatedPond = await db.query(
      "UPDATE ponds SET name = $1, location = $2, description = $3 WHERE id = $4 RETURNING *",
      [newName, newLocation, newDescription, id]
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
      return res.status(404).json({
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
