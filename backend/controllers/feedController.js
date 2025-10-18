const db = require("../db");

// Fungsi untuk mendapatkan jadwal pakan untuk satu kolam (Admin Only)
exports.getFeedSchedulesByPondId = async (req, res) => {
  try {
    const { pondId } = req.params;
    const adminUserId = req.user.id;

    // Query untuk mengambil jadwal pakan dari kolam yang dimiliki oleh admin
    const schedules = await db.query(
      `SELECT fs.* FROM feed_schedules fs
       JOIN ponds p ON fs.pond_id = p.id
       WHERE fs.pond_id = $1 AND p.user_id = $2
       ORDER BY fs.feed_time ASC`,
      [pondId, adminUserId]
    );

    res.status(200).json(schedules.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk membuat jadwal pakan baru (Admin Only)
exports.createFeedSchedule = async (req, res) => {
  const { pond_id, feed_time, amount_kg, feed_date } = req.body;

  // Validasi input
  if (!pond_id || !feed_time || !amount_kg) {
    return res
      .status(400)
      .json({ message: "pond_id, feed_time, dan amount_kg harus diisi" });
  }

  try {
    const newSchedule = await db.query(
      "INSERT INTO feed_schedules (pond_id, feed_time, amount_kg, feed_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [pond_id, feed_time, amount_kg, feed_date || new Date()] // Jika tanggal tidak diberikan, gunakan tanggal hari ini
    );

    res.status(201).json({
      message: "Jadwal pakan berhasil ditambahkan",
      schedule: newSchedule.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    if (error.code === "23503") {
      // Foreign key violation
      return res
        .status(404)
        .json({ message: `Kolam dengan ID ${pond_id} tidak ditemukan.` });
    }
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk memperbarui jadwal pakan (misal: menandai selesai)
exports.updateFeedSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { feed_time, amount_kg, is_done } = req.body;

    // Cek dulu jadwalnya ada atau tidak
    const scheduleExist = await db.query(
      "SELECT * FROM feed_schedules WHERE id = $1",
      [scheduleId]
    );
    if (scheduleExist.rows.length === 0) {
      return res.status(404).json({ message: "Jadwal pakan tidak ditemukan" });
    }
    const currentSchedule = scheduleExist.rows[0];

    // Gunakan data baru jika ada, jika tidak, gunakan data lama
    const newTime = feed_time || currentSchedule.feed_time;
    const newAmount = amount_kg || currentSchedule.amount_kg;
    // Periksa 'is_done' secara eksplisit karena nilainya bisa boolean 'false'
    const newStatus = is_done !== undefined ? is_done : currentSchedule.is_done;

    const updatedSchedule = await db.query(
      "UPDATE feed_schedules SET feed_time = $1, amount_kg = $2, is_done = $3 WHERE id = $4 RETURNING *",
      [newTime, newAmount, newStatus, scheduleId]
    );

    res.status(200).json({
      message: "Jadwal pakan berhasil diperbarui",
      schedule: updatedSchedule.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
