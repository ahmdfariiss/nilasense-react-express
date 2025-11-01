const db = require("../config/database");
const mlService = require("../services/mlService");

// Fungsi untuk menambahkan log data sensor baru (Admin/Sistem)
exports.addLog = async (req, res) => {
  const { pond_id, temperature, ph_level, dissolved_oxygen, turbidity } =
    req.body;

  // Validasi input
  if (
    !pond_id ||
    temperature === undefined ||
    ph_level === undefined ||
    dissolved_oxygen === undefined ||
    turbidity === undefined
  ) {
    return res.status(400).json({
      message:
        "Semua parameter sensor (pond_id, temperature, ph_level, dissolved_oxygen, turbidity) harus diisi",
    });
  }

  try {
    // Get ML prediction
    let mlPrediction = null;
    try {
      const prediction = await mlService.predictWaterQuality({
        ph: ph_level,
        temperature,
        turbidity,
        dissolved_oxygen,
        pond_id,
      });

      if (prediction.success) {
        mlPrediction = prediction.data;
      }
    } catch (mlError) {
      console.error("ML Prediction error:", mlError.message);
      // Continue without ML prediction if it fails
    }

    const newLog = await db.query(
      "INSERT INTO water_quality_logs (pond_id, temperature, ph_level, dissolved_oxygen, turbidity) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [pond_id, temperature, ph_level, dissolved_oxygen, turbidity]
    );

    res.status(201).json({
      message: "Data log sensor berhasil disimpan",
      log: newLog.rows[0],
      ml_prediction: mlPrediction, // Include ML prediction in response
    });
  } catch (error) {
    console.error(error.message);
    // Cek jika pond_id tidak valid
    if (error.code === "23503") {
      // Foreign key violation
      return res
        .status(404)
        .json({ message: `Kolam dengan ID ${pond_id} tidak ditemukan.` });
    }
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk mendapatkan semua log dari satu kolam (Buyer, Admin & Petambak)
exports.getLogsByPondId = async (req, res) => {
  try {
    const { pondId } = req.params; // Ambil ID kolam dari parameter URL
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const userPondId = req.user?.pond_id;

    // Validate access for petambak
    if (userRole === "petambak") {
      if (!userPondId) {
        return res.status(403).json({
          message: "Petambak belum di-assign ke kolam",
        });
      }
      // Petambak can only access their assigned pond
      if (parseInt(pondId) !== userPondId) {
        return res.status(403).json({
          message:
            "Anda hanya dapat mengakses data kolam yang di-assign kepada Anda",
        });
      }
    }

    // Get limit from query parameter (for latest data)
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    // Query untuk mengambil log dari kolam tertentu, diurutkan dari yang terbaru
    let query =
      "SELECT * FROM water_quality_logs WHERE pond_id = $1 ORDER BY logged_at DESC";
    let queryParams = [pondId];

    if (limit && limit > 0) {
      query += " LIMIT $2";
      queryParams.push(limit);
    }

    const logs = await db.query(query, queryParams);

    // Get ML prediction for the latest log if available
    let mlPrediction = null;
    if (logs.rows.length > 0) {
      const latestLog = logs.rows[0];
      try {
        const prediction = await mlService.predictWaterQuality({
          ph: latestLog.ph_level,
          temperature: latestLog.temperature,
          turbidity: latestLog.turbidity,
          dissolved_oxygen: latestLog.dissolved_oxygen,
          pond_id: parseInt(pondId),
        });

        if (prediction.success) {
          mlPrediction = prediction.data;
        }
      } catch (mlError) {
        console.error("ML Prediction error:", mlError.message);
        // Continue without ML prediction if it fails
      }
    }

    // Tidak apa-apa jika hasilnya array kosong, tidak perlu error 404
    res.status(200).json({
      logs: logs.rows,
      ml_prediction: mlPrediction, // Include ML prediction for latest data
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk menganalisis kualitas air menggunakan ML Service
exports.analyzeWaterQuality = async (req, res) => {
  const { temperature, ph_level, dissolved_oxygen, turbidity } = req.body;

  // Validasi input
  if (
    temperature === undefined ||
    ph_level === undefined ||
    dissolved_oxygen === undefined ||
    turbidity === undefined
  ) {
    return res
      .status(400)
      .json({ message: "Semua parameter sensor harus diisi untuk analisis" });
  }

  try {
    // Get ML prediction
    const prediction = await mlService.predictWaterQuality({
      ph: ph_level,
      temperature,
      turbidity,
      dissolved_oxygen,
    });

    if (prediction.success) {
      return res.status(200).json({
        success: true,
        message: "Analisis kualitas air berhasil",
        input_data: {
          ph: ph_level,
          temperature,
          turbidity,
          dissolved_oxygen,
        },
        analysis: prediction.data, // Full ML prediction result
      });
    } else {
      // Fallback if ML service fails
      return res.status(503).json({
        success: false,
        message: "Layanan ML tidak tersedia",
        error: prediction.error,
        input_data: req.body,
      });
    }
  } catch (error) {
    console.error("Analyze water quality error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
