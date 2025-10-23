import api from './api.js';

/**
 * User Service untuk mengelola data users
 * Admin only - untuk manage buyers dan admin accounts
 */
class UserService {
  // Mendapatkan semua users (untuk admin)
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return {
        success: true,
        data: response.data,
        message: 'Data users berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Gagal mengambil data users'
      };
    }
  }

  // Mendapatkan user berdasarkan ID
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return {
        success: true,
        data: response.data,
        message: 'Data user berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal mengambil data user'
      };
    }
  }

  // Membuat user baru (untuk admin)
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return {
        success: true,
        data: response.data.user,
        message: response.data.message || 'User berhasil dibuat'
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal membuat user'
      };
    }
  }

  // Memperbarui user (untuk admin)
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return {
        success: true,
        data: response.data.user,
        message: response.data.message || 'User berhasil diperbarui'
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal memperbarui user'
      };
    }
  }

  // Menghapus user (untuk admin)
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return {
        success: true,
        data: null,
        message: response.data.message || 'User berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal menghapus user'
      };
    }
  }

  // Update role user (untuk admin)
  async updateUserRole(userId, newRole) {
    try {
      const response = await api.put(`/users/${userId}`, { role: newRole });
      return {
        success: true,
        data: response.data.user,
        message: 'Role user berhasil diperbarui'
      };
    } catch (error) {
      console.error('Error updating user role:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal memperbarui role user'
      };
    }
  }

  // Mendapatkan statistik users
  getUserStatistics(users) {
    if (!Array.isArray(users)) {
      return {
        total: 0,
        admins: 0,
        buyers: 0,
        recentRegistrations: 0
      };
    }

    const admins = users.filter(u => u.role === 'admin');
    const buyers = users.filter(u => u.role === 'buyer');

    // Hitung registrasi dalam 30 hari terakhir
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRegistrations = users.filter(u => {
      const createdDate = new Date(u.created_at);
      return createdDate >= thirtyDaysAgo;
    });

    return {
      total: users.length,
      admins: admins.length,
      buyers: buyers.length,
      recentRegistrations: recentRegistrations.length
    };
  }

  // Format role untuk tampilan
  getRoleLabel(role) {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'buyer':
        return 'Pembeli';
      default:
        return 'Unknown';
    }
  }

  // Get role badge class
  getRoleBadgeClass(role) {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'buyer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  // Validasi data user
  validateUserData(data, isEdit = false) {
    const errors = [];

    if (!data.name || data.name.trim().length < 3) {
      errors.push('Nama harus minimal 3 karakter');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Email tidak valid');
    }

    if (!isEdit && (!data.password || data.password.length < 6)) {
      errors.push('Password harus minimal 6 karakter');
    }

    if (data.password && data.password.length > 0 && data.password.length < 6) {
      errors.push('Password harus minimal 6 karakter');
    }

    if (!data.role || !['admin', 'buyer'].includes(data.role)) {
      errors.push('Role harus dipilih (admin atau buyer)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validasi format email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Format tanggal registrasi
  formatRegistrationDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  // Filter users berdasarkan role
  filterByRole(users, role) {
    if (!Array.isArray(users)) return [];
    if (role === 'all') return users;
    return users.filter(u => u.role === role);
  }

  // Search users
  searchUsers(users, searchTerm) {
    if (!Array.isArray(users) || !searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  }
}

export default new UserService();
