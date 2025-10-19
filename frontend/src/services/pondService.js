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
}

export default new PondService();