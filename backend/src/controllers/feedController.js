const db = require("../config/database");

// Fungsi untuk mendapatkan jadwal pakan untuk satu kolam (Admin & Petambak)
exports.getFeedSchedulesByPondId = async (req, res) => {
  try {
    const { pondId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;
    const { date } = req.query; // Optional date filter

    // Validate access based on role
    if (userRole === "admin") {
      // Admin: check if pond belongs to them
      const pondCheck = await db.query(
        "SELECT * FROM ponds WHERE id = $1 AND user_id = $2",
        [pondId, userId]
      );
      if (pondCheck.rows.length === 0) {
        return res.status(403).json({
          message: "Kolam tidak ditemukan atau Anda tidak memiliki akses",
        });
      }
    } else if (userRole === "petambak") {
      // Petambak: check if pond matches their assigned pond
      if (!userPondId || parseInt(pondId) !== userPondId) {
        return res.status(403).json({
          message:
            "Anda hanya dapat mengakses kolam yang di-assign kepada Anda",
        });
      }
    }

    let query = `SELECT fs.*, p.name as pond_name FROM feed_schedules fs
                 JOIN ponds p ON fs.pond_id = p.id
                 WHERE fs.pond_id = $1`;
    let params = [pondId];

    // Add date filter if provided
    if (date) {
      query += ` AND fs.feed_date = $2`;
      params.push(date);
    } else {
      // Default to today's schedules
      query += ` AND fs.feed_date = CURRENT_DATE`;
    }

    query += ` ORDER BY fs.feed_time ASC`;

    const schedules = await db.query(query, params);

    res.status(200).json(schedules.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk mendapatkan jadwal pakan yang bisa diakses user (Buyer, Admin & Petambak)
exports.getAccessibleFeedSchedules = async (req, res) => {
  try {
    const { pondId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;
    const { date } = req.query; // Optional date filter

    let query;
    let params;

    if (userRole === "admin") {
      // Admin hanya bisa lihat jadwal kolam miliknya
      query = `SELECT fs.*, p.name as pond_name FROM feed_schedules fs
               JOIN ponds p ON fs.pond_id = p.id
               WHERE fs.pond_id = $1 AND p.user_id = $2`;
      params = [pondId, userId];
    } else if (userRole === "petambak") {
      // Petambak hanya bisa lihat jadwal kolam yang di-assign
      if (!userPondId || parseInt(pondId) !== userPondId) {
        return res.status(403).json({
          message:
            "Anda hanya dapat mengakses kolam yang di-assign kepada Anda",
        });
      }
      query = `SELECT fs.*, p.name as pond_name FROM feed_schedules fs
               JOIN ponds p ON fs.pond_id = p.id
               WHERE fs.pond_id = $1`;
      params = [pondId];
    } else {
      // Buyer bisa lihat semua jadwal (untuk demo purposes)
      query = `SELECT fs.*, p.name as pond_name FROM feed_schedules fs
               JOIN ponds p ON fs.pond_id = p.id
               WHERE fs.pond_id = $1`;
      params = [pondId];
    }

    // Add date filter if provided
    if (date) {
      query += ` AND fs.feed_date = $${params.length + 1}`;
      params.push(date);
    } else {
      // Default to today's schedules
      query += ` AND fs.feed_date = CURRENT_DATE`;
    }

    query += ` ORDER BY fs.feed_time ASC`;

    const schedules = await db.query(query, params);

    res.status(200).json(schedules.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk mendapatkan ringkasan jadwal pakan hari ini
exports.getTodayFeedSummary = async (req, res) => {
  try {
    const { pondId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;

    // Validate access for petambak
    if (userRole === "petambak") {
      if (!userPondId || parseInt(pondId) !== userPondId) {
        return res.status(403).json({
          message:
            "Anda hanya dapat mengakses kolam yang di-assign kepada Anda",
        });
      }
    }

    let query;
    let params;

    if (userRole === "admin") {
      query = `SELECT 
                 COUNT(*) as total_schedules,
                 COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_schedules,
                 COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_schedules,
                 COALESCE(SUM(amount_kg), 0) as total_amount,
                 COALESCE(SUM(CASE WHEN status = 'completed' THEN amount_kg ELSE 0 END), 0) as completed_amount,
                 MIN(CASE WHEN status = 'pending' THEN feed_time END) as next_feed_time,
                 STRING_AGG(DISTINCT feed_type, ', ') as feed_types
               FROM feed_schedules fs
               JOIN ponds p ON fs.pond_id = p.id
               WHERE fs.pond_id = $1 AND p.user_id = $2 AND fs.feed_date = CURRENT_DATE`;
      params = [pondId, userId];
    } else {
      // For petambak and buyer
      query = `SELECT 
                 COUNT(*) as total_schedules,
                 COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_schedules,
                 COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_schedules,
                 COALESCE(SUM(amount_kg), 0) as total_amount,
                 COALESCE(SUM(CASE WHEN status = 'completed' THEN amount_kg ELSE 0 END), 0) as completed_amount,
                 MIN(CASE WHEN status = 'pending' THEN feed_time END) as next_feed_time,
                 STRING_AGG(DISTINCT feed_type, ', ') as feed_types
               FROM feed_schedules fs
               WHERE fs.pond_id = $1 AND fs.feed_date = CURRENT_DATE`;
      params = [pondId];
    }

    const result = await db.query(query, params);
    const summary = result.rows[0];

    // Format the response
    const response = {
      totalSchedules: parseInt(summary.total_schedules) || 0,
      completedSchedules: parseInt(summary.completed_schedules) || 0,
      pendingSchedules: parseInt(summary.pending_schedules) || 0,
      totalAmount: parseFloat(summary.total_amount) || 0,
      completedAmount: parseFloat(summary.completed_amount) || 0,
      nextFeedTime: summary.next_feed_time,
      feedTypes: summary.feed_types || "Belum ada jadwal",
      status: summary.pending_schedules > 0 ? "Menunggu" : "Selesai",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk membuat jadwal pakan baru (Admin & Petambak)
exports.createFeedSchedule = async (req, res) => {
  const { pond_id, feed_time, amount_kg, feed_type, feed_date } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;
  const userPondId = req.user.pond_id;

  // Validasi input
  if (!pond_id || !feed_time || !amount_kg) {
    return res
      .status(400)
      .json({ message: "pond_id, feed_time, dan amount_kg harus diisi" });
  }

  try {
    // Validate access based on role
    if (userRole === "admin") {
      // Admin: check if pond belongs to them
      const pondCheck = await db.query(
        "SELECT id FROM ponds WHERE id = $1 AND user_id = $2",
        [pond_id, userId]
      );
      if (pondCheck.rows.length === 0) {
        return res.status(404).json({
          message: "Kolam tidak ditemukan atau Anda tidak memiliki akses",
        });
      }
    } else if (userRole === "petambak") {
      // Petambak: check if pond matches their assigned pond
      if (!userPondId || parseInt(pond_id) !== userPondId) {
        return res.status(403).json({
          message:
            "Anda hanya dapat mengelola jadwal pakan untuk kolam yang di-assign kepada Anda",
        });
      }
    }

    const newSchedule = await db.query(
      "INSERT INTO feed_schedules (pond_id, feed_time, amount_kg, feed_type, feed_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        pond_id,
        feed_time,
        amount_kg,
        feed_type || "Pelet Standar",
        feed_date || new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
      ]
    );

    res.status(201).json({
      message: "Jadwal pakan berhasil ditambahkan",
      schedule: newSchedule.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    if (error.code === "23503") {
      return res
        .status(404)
        .json({ message: `Kolam dengan ID ${pond_id} tidak ditemukan.` });
    }
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk memperbarui jadwal pakan (Admin, Petambak & Buyer)
exports.updateFeedSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { feed_time, amount_kg, feed_type, status, is_done } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;

    // Cek jadwal dan akses
    let scheduleQuery;
    let queryParams;

    if (userRole === "admin") {
      scheduleQuery = `SELECT fs.* FROM feed_schedules fs
                       JOIN ponds p ON fs.pond_id = p.id
                       WHERE fs.id = $1 AND p.user_id = $2`;
      queryParams = [scheduleId, userId];
    } else if (userRole === "petambak") {
      scheduleQuery = `SELECT fs.* FROM feed_schedules fs
                       WHERE fs.id = $1 AND fs.pond_id = $2`;
      queryParams = [scheduleId, userPondId];
    } else {
      // Buyer hanya bisa update status (mark as completed)
      scheduleQuery = `SELECT fs.* FROM feed_schedules fs WHERE fs.id = $1`;
      queryParams = [scheduleId];
    }

    const scheduleExist = await db.query(scheduleQuery, queryParams);

    if (scheduleExist.rows.length === 0) {
      return res.status(404).json({
        message: "Jadwal pakan tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    const currentSchedule = scheduleExist.rows[0];

    // Prepare update data
    const newTime = feed_time || currentSchedule.feed_time;
    const newAmount = amount_kg || currentSchedule.amount_kg;
    const newFeedType = feed_type || currentSchedule.feed_type;

    // Handle status update
    let newStatus = currentSchedule.status;
    let newIsDone = currentSchedule.is_done;

    if (status !== undefined) {
      newStatus = status;
      newIsDone = status === "completed";
    } else if (is_done !== undefined) {
      newIsDone = is_done;
      newStatus = is_done ? "completed" : "pending";
    }

    // For buyers, only allow status updates
    if (userRole === "buyer") {
      if (feed_time || amount_kg || feed_type) {
        return res.status(403).json({
          message: "Anda hanya dapat mengubah status jadwal pakan",
        });
      }
    }

    const updatedSchedule = await db.query(
      "UPDATE feed_schedules SET feed_time = $1, amount_kg = $2, feed_type = $3, status = $4, is_done = $5 WHERE id = $6 RETURNING *",
      [newTime, newAmount, newFeedType, newStatus, newIsDone, scheduleId]
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

// Fungsi untuk menghapus jadwal pakan (Admin & Petambak)
exports.deleteFeedSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;

    // Cek jadwal dan akses
    let scheduleQuery;
    let queryParams;

    if (userRole === "admin") {
      scheduleQuery = `SELECT fs.* FROM feed_schedules fs
                       JOIN ponds p ON fs.pond_id = p.id
                       WHERE fs.id = $1 AND p.user_id = $2`;
      queryParams = [scheduleId, userId];
    } else if (userRole === "petambak") {
      scheduleQuery = `SELECT fs.* FROM feed_schedules fs
                       WHERE fs.id = $1 AND fs.pond_id = $2`;
      queryParams = [scheduleId, userPondId];
    } else {
      return res.status(403).json({
        message: "Anda tidak memiliki akses untuk menghapus jadwal pakan",
      });
    }

    const scheduleExist = await db.query(scheduleQuery, queryParams);

    if (scheduleExist.rows.length === 0) {
      return res.status(404).json({
        message: "Jadwal pakan tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    await db.query("DELETE FROM feed_schedules WHERE id = $1", [scheduleId]);

    res.status(200).json({
      message: "Jadwal pakan berhasil dihapus",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
