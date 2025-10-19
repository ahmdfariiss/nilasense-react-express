import { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Filter,
  Download,
  Upload,
  AlertCircle,
  Loader2,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import AdminLayout from '@/components/layouts/AdminLayout';
import productService from '@/services/productService';

// Loading skeleton component
function ProductTableLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-16 w-16 rounded" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState({ searchTerm, onAddProduct, onClearSearch }) {
  return (
    <div className="text-center py-12">
      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {searchTerm ? 'Tidak ada produk yang cocok' : 'Belum ada produk'}
      </h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm 
          ? `Tidak ditemukan produk dengan kata kunci "${searchTerm}"`
          : 'Mulai dengan menambahkan produk pertama Anda'
        }
      </p>
      <div className="flex gap-2 justify-center">
        {searchTerm && (
          <Button variant="outline" onClick={onClearSearch}>
            Hapus Filter
          </Button>
        )}
        <Button onClick={onAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Produk
        </Button>
      </div>
    </div>
  );
}

// Product Form Component
function ProductForm({ isOpen, onClose, onSubmit, editData, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_kg: '',
    category: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        description: editData.description || '',
        price: editData.price || '',
        stock_kg: editData.stock_kg || '',
        category: editData.category || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_kg: '',
        category: ''
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert price and stock to numbers
    const processedData = {
      ...formData,
      price: parseFloat(formData.price),
      stock_kg: parseFloat(formData.stock_kg)
    };
    
    // Validate form
    const validation = productService.validateProductData(processedData);
    if (!validation.isValid) {
      const newErrors = {};
      validation.errors.forEach(error => {
        if (error.includes('Nama')) newErrors.name = error;
        if (error.includes('Harga')) newErrors.price = error;
        if (error.includes('Stok')) newErrors.stock_kg = error;
        if (error.includes('Deskripsi')) newErrors.description = error;
        if (error.includes('Kategori')) newErrors.category = error;
      });
      setErrors(newErrors);
      return;
    }

    onSubmit(processedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Produk' : 'Tambah Produk Baru'}
          </DialogTitle>
          <DialogDescription>
            {editData 
              ? 'Perbarui informasi produk'
              : 'Tambahkan produk baru ke katalog'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk *</Label>
            <Input
              id="name"
              placeholder="Contoh: Nila Premium, Bibit Nila"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="50000"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_kg">Stok (kg) *</Label>
              <Input
                id="stock_kg"
                type="number"
                step="0.1"
                placeholder="100"
                value={formData.stock_kg}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_kg: e.target.value }))}
                className={errors.stock_kg ? 'border-red-500' : ''}
              />
              {errors.stock_kg && (
                <p className="text-sm text-red-500">{errors.stock_kg}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              placeholder="Contoh: Ikan Segar, Bibit, Pakan"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={errors.category ? 'border-red-500' : ''}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Deskripsi produk..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editData ? 'Perbarui' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Product Detail Modal
function ProductDetailModal({ isOpen, onClose, product }) {
  if (!product) return null;

  const formatted = productService.formatProductData(product);
  const stockStatus = productService.getStockStatus(product.stock_kg);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            {product.name}
          </DialogTitle>
          <DialogDescription>
            Detail informasi produk
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Nama Produk</Label>
              <p className="text-foreground">{product.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
              <p className="text-foreground">{formatted.category_display}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Harga</Label>
              <p className="text-foreground font-semibold">{formatted.price_formatted}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Stok</Label>
              <div className="flex items-center gap-2">
                <p className="text-foreground">{formatted.stock_formatted}</p>
                <Badge variant="outline" className={`text-${stockStatus.color}-600 border-${stockStatus.color}-200 bg-${stockStatus.color}-50`}>
                  {stockStatus.label}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Deskripsi</Label>
            <p className="text-foreground">{formatted.description_display}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</Label>
              <p className="text-foreground">{formatted.created_at_formatted}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">ID Produk</Label>
              <p className="text-foreground font-mono">#{product.id}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-muted-foreground mb-3 block">Nilai Inventori</Label>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {productService.formatCurrency(product.price * product.stock_kg)}
              </p>
              <p className="text-sm text-muted-foreground">Total Nilai Stok</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminProductManagementPage() {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Detail modal states
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Statistics
  const [statistics, setStatistics] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
    inStockProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    averagePrice: 0
  });

  // Load products data
  const fetchProducts = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);

      const result = await productService.getAllProducts();
      
      if (result.success) {
        setProducts(result.data);
        
        // Calculate statistics
        const stats = productService.calculateStatistics(result.data);
        setStatistics(stats);
        
        if (showToast) {
          toast.success("Data produk berhasil diperbarui");
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Gagal memuat data produk");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = () => {
    fetchProducts(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      let result;
      if (editingProduct) {
        result = await productService.updateProduct(editingProduct.id, formData);
      } else {
        result = await productService.createProduct(formData);
      }
      
      if (result.success) {
        toast.success(result.message);
        setShowForm(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(editingProduct ? "Gagal memperbarui produk" : "Gagal menambah produk");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setDeleting(true);
      const result = await productService.deleteProduct(productId);
      
      if (result.success) {
        toast.success(result.message);
        setDeleteConfirm(null);
        fetchProducts();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Gagal menghapus produk");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStockFilter('all');
  };

  const handleExportData = async () => {
    try {
      // Prepare CSV data
      const csvHeaders = ['ID', 'Nama', 'Kategori', 'Harga', 'Stok (kg)', 'Total Nilai', 'Status Stok', 'Tanggal Dibuat'];
      const csvData = filteredProducts.map(product => {
        const stockStatus = productService.getStockStatus(product.stock_kg);
        return [
          product.id,
          product.name,
          product.category || '',
          product.price,
          product.stock_kg,
          product.price * product.stock_kg,
          stockStatus.label,
          new Date(product.created_at).toLocaleDateString('id-ID')
        ];
      });

      // Create CSV content
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.join(','))
        .join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data berhasil diekspor");
    } catch (error) {
      toast.error("Gagal mengekspor data");
    }
  };

  // Filter and sort products
  let filteredProducts = productService.searchProducts(products, searchTerm);
  filteredProducts = productService.filterByCategory(filteredProducts, categoryFilter);
  filteredProducts = productService.filterByStock(filteredProducts, stockFilter);
  filteredProducts = productService.sortProducts(filteredProducts, sortBy, sortOrder);

  // Get categories for filter
  const categories = productService.getCategories(products);

  if (loading) {
    return (
      <AdminLayout title="Manajemen Produk" subtitle="Kelola produk yang dijual di platform">
        <ProductTableLoading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manajemen Produk" subtitle="Kelola produk yang dijual di platform">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Produk</p>
                  <p className="text-xl font-bold">{statistics.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Stok</p>
                  <p className="text-xl font-bold">{statistics.totalStock.toFixed(1)} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Nilai Inventori</p>
                  <p className="text-xl font-bold">{productService.formatCurrency(statistics.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Stok Rendah</p>
                  <p className="text-xl font-bold">{statistics.lowStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Stok</SelectItem>
                <SelectItem value="in_stock">Tersedia</SelectItem>
                <SelectItem value="low_stock">Stok Rendah</SelectItem>
                <SelectItem value="out_of_stock">Habis</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Terbaru</SelectItem>
                <SelectItem value="created_at-asc">Terlama</SelectItem>
                <SelectItem value="name-asc">Nama A-Z</SelectItem>
                <SelectItem value="name-desc">Nama Z-A</SelectItem>
                <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
                <SelectItem value="price-asc">Harga Terendah</SelectItem>
                <SelectItem value="stock_kg-desc">Stok Terbanyak</SelectItem>
                <SelectItem value="stock_kg-asc">Stok Tersedikit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleExportData}
              disabled={filteredProducts.length === 0}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Memperbarui...' : 'Perbarui'}
            </Button>
            <Button onClick={handleAddProduct}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Daftar Produk ({filteredProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <EmptyState 
                searchTerm={searchTerm}
                onAddProduct={handleAddProduct}
                onClearSearch={handleClearSearch}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const formatted = productService.formatProductData(product);
                    const stockStatus = productService.getStockStatus(product.stock_kg);
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-sm text-muted-foreground">ID: #{product.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{formatted.category_display}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{formatted.price_formatted}</span>
                        </TableCell>
                        <TableCell>
                          <span>{formatted.stock_formatted}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-${stockStatus.color}-600 border-${stockStatus.color}-200 bg-${stockStatus.color}-50`}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {productService.formatCurrency(product.price * product.stock_kg)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetail(product)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm(product)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <ProductForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSubmit={handleFormSubmit}
          editData={editingProduct}
          loading={formLoading}
        />

        {/* Detail Modal */}
        <ProductDetailModal
          isOpen={showDetail}
          onClose={() => {
            setShowDetail(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Konfirmasi Hapus Produk
              </AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus produk <strong>"{deleteConfirm?.name}"</strong>?
                <br />
                <span className="text-red-600 font-medium">
                  Tindakan ini tidak dapat dibatalkan.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteProduct(deleteConfirm.id)}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

export default AdminProductManagementPage;