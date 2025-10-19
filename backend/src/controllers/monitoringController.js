const db = require("../config/db");

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
    const newLog = await db.query(
      "INSERT INTO water_quality_logs (pond_id, temperature, ph_level, dissolved_oxygen, turbidity) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [pond_id, temperature, ph_level, dissolved_oxygen, turbidity]
    );

    res.status(201).json({
      message: "Data log sensor berhasil disimpan",
      log: newLog.rows[0],
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

// Fungsi untuk mendapatkan semua log dari satu kolam (Buyer & Admin)
exports.getLogsByPondId = async (req, res) => {
  try {
    const { pondId } = req.params; // Ambil ID kolam dari parameter URL

    // Query untuk mengambil semua log dari kolam tertentu, diurutkan dari yang terbaru
    const logs = await db.query(
      "SELECT * FROM water_quality_logs WHERE pond_id = $1 ORDER BY logged_at DESC",
      [pondId]
    );

    // Tidak apa-apa jika hasilnya array kosong, tidak perlu error 404
    res.status(200).json(logs.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk menganalisis kualitas air (Admin Only - Placeholder)
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

  // --- SIMULASI PEMANGGILAN MODEL ML ---

  let analysisResult = "Kualitas air Baik.";
  let suggestion =
    "Kondisi optimal, pertahankan kualitas air dan jadwal pakan.";

  if (ph_level < 6.5 || ph_level > 8.5) {
    analysisResult = "Kualitas air Perlu Perhatian.";
    suggestion =
      "Tingkat pH di luar batas normal. Pertimbangkan untuk melakukan penyesuaian.";
  } else if (dissolved_oxygen < 5) {
    analysisResult = "Kualitas air Kurang Baik.";
    suggestion =
      "Tingkat oksigen terlarut rendah. Periksa aerator atau pertimbangkan penambahan kincir air.";
  }

  // Mengembalikan hasil simulasi
  res.status(200).json({
    message: "Analisis berhasil disimulasikan",
    input_data: req.body,
    analysis: {
      result: analysisResult,
      suggestion: suggestion,
    },
  });
};
