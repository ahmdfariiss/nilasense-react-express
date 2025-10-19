import api from './api.js';

// Product Service untuk mengelola data produk
class ProductService {
  // Mendapatkan semua produk (publik)
  async getAllProducts() {
    try {
      const response = await api.get('/products');
      return {
        success: true,
        data: response.data,
        message: 'Data produk berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Gagal mengambil data produk'
      };
    }
  }

  // Mendapatkan produk berdasarkan ID
  async getProductById(productId) {
    try {
      const response = await api.get(`/products/${productId}`);
      return {
        success: true,
        data: response.data,
        message: 'Data produk berhasil diambil'
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal mengambil data produk'
      };
    }
  }

  // Membuat produk baru (admin only)
  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return {
        success: true,
        data: response.data.product,
        message: response.data.message || 'Produk berhasil dibuat'
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal membuat produk'
      };
    }
  }

  // Memperbarui produk (admin only)
  async updateProduct(productId, productData) {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return {
        success: true,
        data: response.data.product,
        message: response.data.message || 'Produk berhasil diperbarui'
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal memperbarui produk'
      };
    }
  }

  // Menghapus produk (admin only)
  async deleteProduct(productId) {
    try {
      const response = await api.delete(`/products/${productId}`);
      return {
        success: true,
        data: null,
        message: response.data.message || 'Produk berhasil dihapus'
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gagal menghapus produk'
      };
    }
  }

  // Validasi data produk
  validateProductData(productData) {
    const errors = [];
    
    if (!productData.name || productData.name.trim().length === 0) {
      errors.push('Nama produk harus diisi');
    }
    
    if (productData.name && productData.name.trim().length < 3) {
      errors.push('Nama produk minimal 3 karakter');
    }
    
    if (productData.name && productData.name.trim().length > 100) {
      errors.push('Nama produk maksimal 100 karakter');
    }
    
    if (!productData.price || productData.price <= 0) {
      errors.push('Harga harus diisi dan lebih dari 0');
    }
    
    if (productData.price && productData.price > 10000000) {
      errors.push('Harga maksimal Rp 10.000.000');
    }
    
    if (!productData.stock_kg || productData.stock_kg < 0) {
      errors.push('Stok harus diisi dan tidak boleh negatif');
    }
    
    if (productData.stock_kg && productData.stock_kg > 100000) {
      errors.push('Stok maksimal 100.000 kg');
    }
    
    if (productData.description && productData.description.length > 1000) {
      errors.push('Deskripsi maksimal 1000 karakter');
    }
    
    if (productData.category && productData.category.length > 50) {
      errors.push('Kategori maksimal 50 karakter');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format data produk untuk display
  formatProductData(product) {
    if (!product) return null;
    
    return {
      ...product,
      price_formatted: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(product.price),
      stock_formatted: `${product.stock_kg} kg`,
      created_at_formatted: product.created_at ? new Date(product.created_at).toLocaleDateString('id-ID') : '-',
      category_display: product.category || 'Tidak ada kategori',
      description_display: product.description || 'Tidak ada deskripsi'
    };
  }

  // Search dan filter produk
  searchProducts(products, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return products;
    
    const term = searchTerm.toLowerCase().trim();
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      (product.description && product.description.toLowerCase().includes(term)) ||
      (product.category && product.category.toLowerCase().includes(term))
    );
  }

  // Filter produk berdasarkan kategori
  filterByCategory(products, category) {
    if (!category || category === 'all') return products;
    
    return products.filter(product => 
      product.category && product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter produk berdasarkan stok
  filterByStock(products, stockFilter) {
    switch (stockFilter) {
      case 'in_stock':
        return products.filter(product => product.stock_kg > 0);
      case 'low_stock':
        return products.filter(product => product.stock_kg > 0 && product.stock_kg <= 10);
      case 'out_of_stock':
        return products.filter(product => product.stock_kg === 0);
      default:
        return products;
    }
  }

  // Sort produk berdasarkan kriteria
  sortProducts(products, sortBy = 'created_at', sortOrder = 'desc') {
    return [...products].sort((a, b) => {
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

  // Get unique categories
  getCategories(products) {
    const categories = products
      .map(product => product.category)
      .filter(category => category && category.trim() !== '')
      .filter((category, index, arr) => arr.indexOf(category) === index)
      .sort();
    
    return categories;
  }

  // Calculate product statistics
  calculateStatistics(products) {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + (product.stock_kg || 0), 0);
    const totalValue = products.reduce((sum, product) => sum + ((product.price || 0) * (product.stock_kg || 0)), 0);
    const inStockProducts = products.filter(product => product.stock_kg > 0).length;
    const lowStockProducts = products.filter(product => product.stock_kg > 0 && product.stock_kg <= 10).length;
    const outOfStockProducts = products.filter(product => product.stock_kg === 0).length;
    const averagePrice = totalProducts > 0 ? products.reduce((sum, product) => sum + (product.price || 0), 0) / totalProducts : 0;

    return {
      totalProducts,
      totalStock,
      totalValue,
      inStockProducts,
      lowStockProducts,
      outOfStockProducts,
      averagePrice
    };
  }

  // Get stock status
  getStockStatus(stockKg) {
    if (stockKg === 0) return { status: 'out_of_stock', label: 'Habis', color: 'red' };
    if (stockKg <= 10) return { status: 'low_stock', label: 'Stok Rendah', color: 'yellow' };
    return { status: 'in_stock', label: 'Tersedia', color: 'green' };
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Format weight
  formatWeight(kg) {
    return `${kg} kg`;
  }
}

export default new ProductService();