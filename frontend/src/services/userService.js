import api from './api.js';

// User Service untuk mengelola data pengguna (admin only)
class UserService {
  // Mendapatkan semua pengguna (admin only)
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return {
        success: true,
        data: response.data,
        message: 'Data pengguna berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Gagal mengambil data pengguna'
      };
    }
  }

  // Mendapatkan pengguna berdasarkan ID (admin only)
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return {
        success: true,
        data: response.data,
        message: 'Data pengguna berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal mengambil data pengguna'
      };
    }
  }

  // Memperbarui pengguna (admin only)
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return {
        success: true,
        data: response.data.user,
        message: response.data.message || 'Data pengguna berhasil diperbarui'
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal memperbarui data pengguna'
      };
    }
  }

  // Menghapus pengguna (admin only)
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return {
        success: true,
        data: null,
        message: response.data.message || 'Pengguna berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal menghapus pengguna'
      };
    }
  }

  // Validasi data pengguna
  validateUserData(userData) {
    const errors = [];
    
    if (!userData.name || userData.name.trim().length === 0) {
      errors.push('Nama harus diisi');
    }
    
    if (userData.name && userData.name.trim().length < 2) {
      errors.push('Nama minimal 2 karakter');
    }
    
    if (userData.name && userData.name.trim().length > 100) {
      errors.push('Nama maksimal 100 karakter');
    }
    
    if (!userData.email || userData.email.trim().length === 0) {
      errors.push('Email harus diisi');
    }
    
    if (userData.email && !this.isValidEmail(userData.email)) {
      errors.push('Format email tidak valid');
    }
    
    if (!userData.role || !['admin', 'buyer'].includes(userData.role)) {
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

  // Format data pengguna untuk display
  formatUserData(user) {
    if (!user) return null;
    
    return {
      ...user,
      created_at_formatted: user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '-',
      role_display: user.role === 'admin' ? 'Administrator' : 'Pembeli',
      role_color: user.role === 'admin' ? 'blue' : 'green'
    };
  }

  // Search dan filter pengguna
  searchUsers(users, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return users;
    
    const term = searchTerm.toLowerCase().trim();
    return users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  // Filter pengguna berdasarkan role
  filterByRole(users, role) {
    if (!role || role === 'all') return users;
    
    return users.filter(user => user.role === role);
  }

  // Sort pengguna berdasarkan kriteria
  sortUsers(users, sortBy = 'created_at', sortOrder = 'desc') {
    return [...users].sort((a, b) => {
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

  // Calculate user statistics
  calculateStatistics(users) {
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const buyerUsers = users.filter(user => user.role === 'buyer').length;
    
    // Calculate registration trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = users.filter(user => 
      new Date(user.created_at) >= thirtyDaysAgo
    ).length;

    return {
      totalUsers,
      adminUsers,
      buyerUsers,
      recentUsers
    };
  }

  // Get role badge configuration
  getRoleBadgeConfig(role) {
    switch (role) {
      case 'admin':
        return {
          label: 'Administrator',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'buyer':
        return {
          label: 'Pembeli',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  }

  // Check if user can be deleted (prevent deleting current user or last admin)
  canDeleteUser(user, currentUserId, allUsers) {
    // Can't delete current user
    if (user.id === currentUserId) {
      return {
        canDelete: false,
        reason: 'Tidak dapat menghapus akun Anda sendiri'
      };
    }

    // Can't delete last admin
    const adminUsers = allUsers.filter(u => u.role === 'admin');
    if (user.role === 'admin' && adminUsers.length <= 1) {
      return {
        canDelete: false,
        reason: 'Tidak dapat menghapus admin terakhir'
      };
    }

    return {
      canDelete: true,
      reason: null
    };
  }

  // Check if user role can be changed
  canChangeRole(user, newRole, currentUserId, allUsers) {
    // Can't change current user's role
    if (user.id === currentUserId) {
      return {
        canChange: false,
        reason: 'Tidak dapat mengubah role akun Anda sendiri'
      };
    }

    // Can't change last admin to buyer
    if (user.role === 'admin' && newRole === 'buyer') {
      const adminUsers = allUsers.filter(u => u.role === 'admin');
      if (adminUsers.length <= 1) {
        return {
          canChange: false,
          reason: 'Tidak dapat mengubah role admin terakhir'
        };
      }
    }

    return {
      canChange: true,
      reason: null
    };
  }

  // Get user activity summary (placeholder for future implementation)
  getUserActivitySummary(user) {
    // This would typically fetch from activity logs
    // For now, return placeholder data
    return {
      lastLogin: 'Belum tersedia',
      totalLogins: 'Belum tersedia',
      pondsOwned: 'Belum tersedia',
      ordersPlaced: 'Belum tersedia'
    };
  }

  // Format date for display
  formatDate(dateString) {
    if (!dateString) return '-';
    
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get time since registration
  getTimeSinceRegistration(createdAt) {
    if (!createdAt) return 'Tidak diketahui';
    
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 hari yang lalu';
    if (diffDays < 30) return `${diffDays} hari yang lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`;
    return `${Math.floor(diffDays / 365)} tahun yang lalu`;
  }
}

export default new UserService();