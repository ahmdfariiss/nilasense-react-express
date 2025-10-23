import api from './api.js';

// Feed Service untuk mengelola jadwal pemberian pakan
class FeedService {
  // Mendapatkan jadwal pakan yang bisa diakses user untuk pond tertentu
  async getAccessibleFeedSchedules(pondId, params = {}) {
    try {
      const response = await api.get(`/feeds/accessible/${pondId}`, { params });
      return {
        success: true,
        data: response.data,
        message: 'Jadwal pakan berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching feed schedules:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Gagal mengambil jadwal pakan'
      };
    }
  }

  // Mendapatkan ringkasan jadwal pakan hari ini
  async getTodayFeedSummary(pondId) {
    try {
      const response = await api.get(`/feeds/summary/${pondId}`);
      return {
        success: true,
        data: response.data,
        message: 'Ringkasan jadwal berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching feed summary:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal mengambil ringkasan jadwal'
      };
    }
  }

  // Mendapatkan jadwal pakan berdasarkan tanggal
  async getFeedSchedulesByDate(pondId, date) {
    try {
      const params = { date };
      const response = await api.get(`/feeds/accessible/${pondId}`, { params });
      return {
        success: true,
        data: response.data,
        message: 'Jadwal pakan berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching feed schedules by date:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Gagal mengambil jadwal pakan'
      };
    }
  }

  // Mendapatkan jadwal pakan untuk admin (semua jadwal kolam milik admin)
  async getAdminFeedSchedulesByDate(pondId, date) {
    try {
      const params = { date };
      const response = await api.get(`/feeds/${pondId}`, { params });
      return {
        success: true,
        data: response.data,
        message: 'Jadwal pakan berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching admin feed schedules by date:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Gagal mengambil jadwal pakan'
      };
    }
  }

  // Membuat jadwal pakan baru (untuk admin)
  async createFeedSchedule(scheduleData) {
    try {
      const response = await api.post('/feeds', scheduleData);
      return {
        success: true,
        data: response.data.schedule,
        message: response.data.message || 'Jadwal pakan berhasil ditambahkan'
      };
    } catch (error) {
      console.error('Error creating feed schedule:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal menambahkan jadwal pakan'
      };
    }
  }

  // Memperbarui jadwal pakan
  async updateFeedSchedule(scheduleId, updateData) {
    try {
      const response = await api.put(`/feeds/${scheduleId}`, updateData);
      return {
        success: true,
        data: response.data.schedule,
        message: response.data.message || 'Jadwal pakan berhasil diperbarui'
      };
    } catch (error) {
      console.error('Error updating feed schedule:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal memperbarui jadwal pakan'
      };
    }
  }

  // Menandai jadwal pakan sebagai selesai
  async markFeedAsCompleted(scheduleId) {
    try {
      const response = await api.put(`/feeds/${scheduleId}`, { 
        status: 'completed' 
      });
      return {
        success: true,
        data: response.data.schedule,
        message: 'Jadwal pakan berhasil ditandai selesai'
      };
    } catch (error) {
      console.error('Error marking feed as completed:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal menandai jadwal selesai'
      };
    }
  }

  // Menandai jadwal pakan sebagai pending
  async markFeedAsPending(scheduleId) {
    try {
      const response = await api.put(`/feeds/${scheduleId}`, { 
        status: 'pending' 
      });
      return {
        success: true,
        data: response.data.schedule,
        message: 'Jadwal pakan berhasil dikembalikan ke pending'
      };
    } catch (error) {
      console.error('Error marking feed as pending:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal mengubah status jadwal'
      };
    }
  }

  // Menghapus jadwal pakan (untuk admin)
  async deleteFeedSchedule(scheduleId) {
    try {
      const response = await api.delete(`/feeds/${scheduleId}`);
      return {
        success: true,
        data: null,
        message: response.data.message || 'Jadwal pakan berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting feed schedule:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal menghapus jadwal pakan'
      };
    }
  }

  // Format data jadwal untuk tabel
  formatSchedulesForTable(schedules) {
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return [];
    }

    return schedules.map(schedule => ({
      id: schedule.id,
      time: schedule.feed_time.substring(0, 5), // HH:MM format
      type: this.getFeedSessionType(schedule.feed_time),
      amount: `${schedule.amount_kg} kg`,
      feedType: schedule.feed_type || 'Pelet Standar',
      status: schedule.status,
      rawData: schedule
    }));
  }

  // Mendapatkan tipe sesi berdasarkan waktu
  getFeedSessionType(feedTime) {
    const hour = parseInt(feedTime.split(':')[0]);
    
    if (hour >= 5 && hour < 11) return 'Pagi';
    if (hour >= 11 && hour < 15) return 'Siang';
    if (hour >= 15 && hour < 19) return 'Sore';
    return 'Malam';
  }

  // Mendapatkan status badge class
  getStatusBadgeClass(status) {
    switch (status) {
      case 'completed':
        return 'bg-[#10b981] text-white';
      case 'pending':
        return 'bg-[#f59e0b] text-white';
      case 'cancelled':
        return 'bg-[#ef4444] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  // Mendapatkan status label
  getStatusLabel(status) {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'pending':
        return 'Menunggu';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return 'Unknown';
    }
  }

  // Mendapatkan jadwal berikutnya
  getNextFeedSchedule(schedules) {
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return null;
    }

    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 8); // HH:MM:SS

    // Cari jadwal pending yang waktunya belum lewat hari ini
    const nextSchedule = schedules
      .filter(schedule => schedule.status === 'pending')
      .find(schedule => schedule.feed_time > currentTime);

    return nextSchedule || null;
  }

  // Mendapatkan statistik jadwal hari ini
  getScheduleStatistics(schedules, summary = null) {
    if (summary) {
      return {
        total: summary.totalSchedules,
        completed: summary.completedSchedules,
        pending: summary.pendingSchedules,
        totalAmount: summary.totalAmount,
        completedAmount: summary.completedAmount,
        nextFeedTime: summary.nextFeedTime,
        feedTypes: summary.feedTypes,
        status: summary.status
      };
    }

    // Fallback calculation from schedules array
    if (!Array.isArray(schedules)) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        totalAmount: 0,
        completedAmount: 0,
        nextFeedTime: null,
        feedTypes: 'Belum ada jadwal',
        status: 'Belum ada jadwal'
      };
    }

    const completed = schedules.filter(s => s.status === 'completed');
    const pending = schedules.filter(s => s.status === 'pending');
    const totalAmount = schedules.reduce((sum, s) => sum + parseFloat(s.amount_kg || 0), 0);
    const completedAmount = completed.reduce((sum, s) => sum + parseFloat(s.amount_kg || 0), 0);
    const nextSchedule = this.getNextFeedSchedule(schedules);
    const feedTypes = [...new Set(schedules.map(s => s.feed_type))].join(', ') || 'Belum ada jadwal';

    return {
      total: schedules.length,
      completed: completed.length,
      pending: pending.length,
      totalAmount,
      completedAmount,
      nextFeedTime: nextSchedule?.feed_time || null,
      feedTypes,
      status: pending.length > 0 ? 'Menunggu' : 'Selesai'
    };
  }

  // Format waktu relatif
  getRelativeTime(feedTime) {
    const now = new Date();
    const [hours, minutes] = feedTime.split(':').map(Number);
    const feedDate = new Date(now);
    feedDate.setHours(hours, minutes, 0, 0);

    const diffMs = feedDate - now;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 0) {
      return 'Sudah lewat';
    } else if (diffMins < 60) {
      return `${diffMins} menit lagi`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours} jam lagi`;
    }
  }

  // Validasi data jadwal
  validateScheduleData(data) {
    const errors = [];

    if (!data.pond_id) {
      errors.push('Kolam harus dipilih');
    }

    if (!data.feed_time) {
      errors.push('Waktu pemberian pakan harus diisi');
    }

    if (!data.amount_kg || data.amount_kg <= 0) {
      errors.push('Jumlah pakan harus lebih dari 0');
    }

    if (data.amount_kg && data.amount_kg > 100) {
      errors.push('Jumlah pakan tidak boleh lebih dari 100 kg');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new FeedService();