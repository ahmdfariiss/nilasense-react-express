import api from './api.js';

// Pond Service untuk mengelola data kolam
class PondService {
  // Mendapatkan semua kolam milik user (untuk admin)
  async getAllPonds() {
    try {
      const response = await api.get('/ponds');
      return {
        success: true,
        data: response.data,
        message: 'Data kolam berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching ponds:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Gagal mengambil data kolam'
      };
    }
  }

  // Mendapatkan kolam yang bisa diakses user (untuk buyer & admin)
  async getAccessiblePonds() {
    try {
      const response = await api.get('/ponds/accessible');
      return {
        success: true,
        data: response.data,
        message: 'Data kolam berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching accessible ponds:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Gagal mengambil data kolam'
      };
    }
  }

  // Mendapatkan kolam berdasarkan ID
  async getPondById(pondId) {
    try {
      const response = await api.get(`/ponds/${pondId}`);
      return {
        success: true,
        data: response.data,
        message: 'Data kolam berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching pond:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal mengambil data kolam'
      };
    }
  }

  // Membuat kolam baru (untuk admin)
  async createPond(pondData) {
    try {
      const response = await api.post('/ponds', pondData);
      return {
        success: true,
        data: response.data.pond,
        message: response.data.message || 'Kolam berhasil dibuat'
      };
    } catch (error) {
      console.error('Error creating pond:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal membuat kolam'
      };
    }
  }

  // Memperbarui kolam (untuk admin)
  async updatePond(pondId, pondData) {
    try {
      const response = await api.put(`/ponds/${pondId}`, pondData);
      return {
        success: true,
        data: response.data.pond,
        message: response.data.message || 'Kolam berhasil diperbarui'
      };
    } catch (error) {
      console.error('Error updating pond:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal memperbarui kolam'
      };
    }
  }

  // Menghapus kolam (untuk admin)
  async deletePond(pondId) {
    try {
      const response = await api.delete(`/ponds/${pondId}`);
      return {
        success: true,
        data: null,
        message: response.data.message || 'Kolam berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting pond:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal menghapus kolam'
      };
    }
  }

  // Format data kolam untuk dropdown/select
  formatPondsForSelect(ponds) {
    if (!Array.isArray(ponds)) return [];
    
    return ponds.map(pond => ({
      value: pond.id,
      label: pond.name,
      location: pond.location,
      created_at: pond.created_at
    }));
  }

  // Mendapatkan kolam default (kolam pertama atau yang dipilih terakhir)
  getDefaultPond(ponds) {
    if (!Array.isArray(ponds) || ponds.length === 0) return null;
    
    // Coba ambil dari localStorage
    const lastSelectedPond = localStorage.getItem('selectedPondId');
    if (lastSelectedPond) {
      const found = ponds.find(pond => pond.id.toString() === lastSelectedPond);
      if (found) return found;
    }
    
    // Fallback ke kolam pertama
    return ponds[0];
  }

  // Simpan pilihan kolam ke localStorage
  saveSelectedPond(pondId) {
    localStorage.setItem('selectedPondId', pondId.toString());
  }

  // Validasi data kolam
  validatePondData(pondData) {
    const errors = [];
    
    if (!pondData.name || pondData.name.trim().length === 0) {
      errors.push('Nama kolam harus diisi');
    }
    
    if (pondData.name && pondData.name.trim().length < 3) {
      errors.push('Nama kolam minimal 3 karakter');
    }
    
    if (pondData.name && pondData.name.trim().length > 100) {
      errors.push('Nama kolam maksimal 100 karakter');
    }
    
    if (pondData.location && pondData.location.trim().length > 255) {
      errors.push('Lokasi maksimal 255 karakter');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format data kolam untuk display
  formatPondData(pond) {
    if (!pond) return null;
    
    return {
      ...pond,
      created_at_formatted: pond.created_at ? new Date(pond.created_at).toLocaleDateString('id-ID') : '-',
      location_display: pond.location || 'Tidak ada lokasi'
    };
  }

  // Search dan filter kolam
  searchPonds(ponds, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return ponds;
    
    const term = searchTerm.toLowerCase().trim();
    return ponds.filter(pond => 
      pond.name.toLowerCase().includes(term) ||
      (pond.location && pond.location.toLowerCase().includes(term))
    );
  }

  // Sort kolam berdasarkan kriteria
  sortPonds(ponds, sortBy = 'created_at', sortOrder = 'desc') {
    return [...ponds].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle date sorting
      if (sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Get pond statistics
  async getPondStatistics(pondId) {
    try {
      const [waterQualityResponse, feedScheduleResponse] = await Promise.all([
        api.get(`/monitoring/logs/${pondId}?limit=1`),
        api.get(`/feeds/accessible/${pondId}`)
      ]);

      const latestWaterQuality = waterQualityResponse.data[0] || null;
      const feedSchedules = feedScheduleResponse.data || [];
      
      const today = new Date().toISOString().split('T')[0];
      const todaySchedules = feedSchedules.filter(schedule => 
        schedule.feed_date === today
      );
      
      return {
        success: true,
        data: {
          latestWaterQuality,
          totalFeedSchedules: feedSchedules.length,
          todayFeedSchedules: todaySchedules.length,
          completedToday: todaySchedules.filter(s => s.is_done).length
        }
      };
    } catch (error) {
      console.error('Error fetching pond statistics:', error);
      return {
        success: false,
        data: null,
        message: 'Gagal mengambil statistik kolam'
      };
    }
  }
}

export default new PondService();