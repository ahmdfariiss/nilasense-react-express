import api from "./api.js";

// Monitoring Service untuk Water Quality
class MonitoringService {
  // Mendapatkan semua log monitoring untuk pond tertentu
  async getWaterQualityLogs(pondId, params = {}) {
    try {
      const response = await api.get(`/monitoring/logs/${pondId}`, { params });

      // Handle both old format (array) and new format (object with logs and ml_prediction)
      const logs = Array.isArray(response.data)
        ? response.data
        : response.data.logs || [];
      const mlPrediction = Array.isArray(response.data)
        ? null
        : response.data.ml_prediction || null;

      return {
        success: true,
        data: logs,
        mlPrediction: mlPrediction,
        message: "Data monitoring berhasil diambil",
      };
    } catch (error) {
      console.error("Error fetching water quality logs:", error);
      return {
        success: false,
        data: [],
        mlPrediction: null,
        message:
          error.response?.data?.message || "Gagal mengambil data monitoring",
      };
    }
  }

  // Mendapatkan data monitoring terbaru untuk pond tertentu
  async getLatestWaterQuality(pondId) {
    try {
      const response = await api.get(`/monitoring/logs/${pondId}?limit=1`);

      // Handle both old format (array) and new format (object with logs and ml_prediction)
      const logs = Array.isArray(response.data)
        ? response.data
        : response.data.logs || [];
      const mlPrediction = Array.isArray(response.data)
        ? null
        : response.data.ml_prediction || null;

      const latestData = logs[0] || null;

      return {
        success: true,
        data: latestData,
        mlPrediction: mlPrediction, // Include ML prediction
        message: latestData
          ? "Data terbaru berhasil diambil"
          : "Belum ada data monitoring",
      };
    } catch (error) {
      console.error("Error fetching latest water quality:", error);
      return {
        success: false,
        data: null,
        mlPrediction: null,
        message:
          error.response?.data?.message || "Gagal mengambil data terbaru",
      };
    }
  }

  // Mendapatkan data monitoring dengan filter tanggal
  async getWaterQualityByDateRange(pondId, startDate, endDate) {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await api.get(`/monitoring/logs/${pondId}`, { params });

      // Handle both old format (array) and new format (object with logs and ml_prediction)
      const logs = Array.isArray(response.data)
        ? response.data
        : response.data.logs || [];
      const mlPrediction = Array.isArray(response.data)
        ? null
        : response.data.ml_prediction || null;

      return {
        success: true,
        data: logs,
        mlPrediction: mlPrediction,
        message: "Data monitoring berhasil diambil",
      };
    } catch (error) {
      console.error("Error fetching water quality by date range:", error);
      return {
        success: false,
        data: [],
        mlPrediction: null,
        message:
          error.response?.data?.message || "Gagal mengambil data monitoring",
      };
    }
  }

  // Menambahkan log monitoring baru (untuk admin)
  async addWaterQualityLog(pondId, data) {
    try {
      const payload = {
        pond_id: pondId,
        temperature: data.temperature,
        ph_level: data.ph_level,
        dissolved_oxygen: data.dissolved_oxygen,
        turbidity: data.turbidity,
      };

      const response = await api.post("/monitoring/logs", payload);
      return {
        success: true,
        data: {
          log: response.data.log,
          ml_prediction: response.data.ml_prediction || null,
        },
        message:
          response.data.message || "Data monitoring berhasil ditambahkan",
      };
    } catch (error) {
      console.error("Error adding water quality log:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Gagal menambahkan data monitoring",
      };
    }
  }

  // Menganalisis kualitas air (untuk admin)
  async analyzeWaterQuality(data) {
    try {
      const response = await api.post("/monitoring/analyze", data);
      return {
        success: response.data.success || true,
        data: response.data.analysis || response.data,
        message: response.data.message || "Analisis berhasil",
      };
    } catch (error) {
      console.error("Error analyzing water quality:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Gagal menganalisis kualitas air",
      };
    }
  }

  // Format data untuk chart
  formatChartData(logs, parameter = "temperature") {
    if (!Array.isArray(logs) || logs.length === 0) {
      return [];
    }

    return logs
      .map((log) => ({
        date: new Date(log.logged_at).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: log.logged_at,
        suhu: parseFloat(log.temperature) || 0,
        ph: parseFloat(log.ph_level) || 0,
        oksigen: parseFloat(log.dissolved_oxygen) || 0,
        kekeruhan: parseFloat(log.turbidity) || 0,
        // Raw values for analysis
        temperature: parseFloat(log.temperature) || 0,
        ph_level: parseFloat(log.ph_level) || 0,
        dissolved_oxygen: parseFloat(log.dissolved_oxygen) || 0,
        turbidity: parseFloat(log.turbidity) || 0,
      }))
      .reverse(); // Reverse to show chronological order in charts
  }

  // Mendapatkan status kualitas air berdasarkan parameter
  getWaterQualityStatus(value, parameter) {
    const thresholds = {
      temperature: { min: 25, max: 30, unit: "°C" },
      ph_level: { min: 6.5, max: 8.5, unit: "" },
      dissolved_oxygen: { min: 5.0, max: 10.0, unit: "mg/L" },
      turbidity: { min: 0, max: 25, unit: "NTU" },
    };

    const threshold = thresholds[parameter];
    if (!threshold) return "unknown";

    if (parameter === "turbidity") {
      // Untuk kekeruhan, semakin rendah semakin baik
      if (value <= 10) return "good";
      if (value <= threshold.max) return "normal";
      return "warning";
    } else {
      // Untuk parameter lain, ada range optimal
      if (value >= threshold.min && value <= threshold.max) {
        return value >= (threshold.min + threshold.max) / 2 ? "good" : "normal";
      }
      return "warning";
    }
  }

  // Mendapatkan statistik dari data monitoring
  getStatistics(logs) {
    if (!Array.isArray(logs) || logs.length === 0) {
      return {
        count: 0,
        averages: {},
        latest: null,
        trends: {},
      };
    }

    const parameters = [
      "temperature",
      "ph_level",
      "dissolved_oxygen",
      "turbidity",
    ];
    const averages = {};
    const trends = {};

    // Hitung rata-rata
    parameters.forEach((param) => {
      const values = logs.map((log) => parseFloat(log[param]) || 0);
      averages[param] =
        values.reduce((sum, val) => sum + val, 0) / values.length;

      // Hitung trend (perbandingan 50% data terbaru vs 50% data terlama)
      const half = Math.floor(values.length / 2);
      const recentAvg =
        values.slice(0, half).reduce((sum, val) => sum + val, 0) / half;
      const oldAvg =
        values.slice(half).reduce((sum, val) => sum + val, 0) /
        (values.length - half);

      if (recentAvg > oldAvg * 1.05) trends[param] = "increasing";
      else if (recentAvg < oldAvg * 0.95) trends[param] = "decreasing";
      else trends[param] = "stable";
    });

    return {
      count: logs.length,
      averages,
      latest: logs[0], // Data terbaru (array sudah diurutkan DESC dari backend)
      trends,
    };
  }
}

export default new MonitoringService();
