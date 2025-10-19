import { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Loader2,
  ImageIcon,
  DollarSign,
  Box,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";
import { toast } from "sonner";

// Form component for creating/editing products
const ProductForm = ({ isOpen, onClose, onSubmit, editData, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_kg: '',
    category: 'Ikan Konsumsi',
    image_url: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        description: editData.description || '',
        price: editData.price || '',
        stock_kg: editData.stock_kg || editData.stock || '',
        category: editData.category || 'Ikan Konsumsi',
        image_url: editData.image_url || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_kg: '',
        category: 'Ikan Konsumsi',
        image_url: ''
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Nama produk harus minimal 3 karakter';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Harga harus lebih dari 0';
    }

    if (!formData.stock_kg || parseFloat(formData.stock_kg) < 0) {
      newErrors.stock_kg = 'Stok tidak boleh negatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert to proper types
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stock_kg: parseFloat(formData.stock_kg)
    };

    onSubmit(submitData);
  };

  const categories = [
    'Ikan Konsumsi',
    'Bibit Ikan',
    'Ikan Olahan',
    'Pakan Ikan',
    'Peralatan'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Produk' : 'Tambah Produk Baru'}
          </DialogTitle>
          <DialogDescription>
            {editData ? 'Perbarui informasi produk' : 'Tambahkan produk baru ke katalog'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Contoh: Nila Premium"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Deskripsi produk..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp/kg) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="50000"
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
                min="0"
                value={formData.stock_kg}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_kg: e.target.value }))}
                placeholder="100"
                className={errors.stock_kg ? 'border-red-500' : ''}
              />
              {errors.stock_kg && (
                <p className="text-sm text-red-500">{errors.stock_kg}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL Gambar</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Masukkan URL gambar produk (opsional)
            </p>
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
};

export function ProductManagementPage({ onNavigate }) {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setRefreshing(true);
      const result = await getAllProducts();
      
      if (result.success) {
        setProducts(result.data);
      } else {
        toast.error(result.error || 'Gagal memuat produk');
      }
    } catch (error) {
      toast.error("Gagal memuat data produk");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateProduct = async (formData) => {
    try {
      setFormLoading(true);
      const result = await createProduct(formData);
      
      if (result.success) {
        toast.success(result.message || 'Produk berhasil ditambahkan');
        setShowForm(false);
        fetchProducts();
      } else {
        toast.error(result.error || 'Gagal menambahkan produk');
      }
    } catch (error) {
      toast.error("Gagal menambahkan produk");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditProduct = async (formData) => {
    try {
      setFormLoading(true);
      const result = await updateProduct(editingProduct.id, formData);
      
      if (result.success) {
        toast.success(result.message || 'Produk berhasil diperbarui');
        setShowForm(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        toast.error(result.error || 'Gagal memperbarui produk');
      }
    } catch (error) {
      toast.error("Gagal memperbarui produk");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setDeleting(true);
      const result = await deleteProduct(productId);
      
      if (result.success) {
        toast.success(result.message || 'Produk berhasil dihapus');
        setDeleteConfirm(null);
        fetchProducts();
      } else {
        toast.error(result.error || 'Gagal menghapus produk');
      }
    } catch (error) {
      toast.error("Gagal menghapus produk");
    } finally {
      setDeleting(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const stats = {
    total: products.length,
    totalStock: products.reduce((sum, p) => sum + (parseFloat(p.stock_kg || p.stock || 0)), 0),
    totalValue: products.reduce((sum, p) => sum + (parseFloat(p.price || 0) * parseFloat(p.stock_kg || p.stock || 0)), 0),
    lowStock: products.filter(p => parseFloat(p.stock_kg || p.stock || 0) < 20).length
  };

  const getStockBadge = (stock) => {
    const stockNum = parseFloat(stock);
    if (stockNum === 0) {
      return <Badge className="bg-red-600 text-white">Habis</Badge>;
    } else if (stockNum < 20) {
      return <Badge className="bg-orange-600 text-white">Stok Rendah</Badge>;
    } else if (stockNum < 50) {
      return <Badge className="bg-yellow-600 text-white">Stok Sedang</Badge>;
    }
    return <Badge className="bg-green-600 text-white">Stok Aman</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
            <span>Memuat data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Manajemen Produk</h1>
          <p className="text-muted-foreground">
            Kelola katalog produk dan inventori
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Produk</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Stok</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalStock.toFixed(1)} kg</p>
                </div>
                <Box className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Nilai Inventori</p>
                  <p className="text-2xl font-bold text-foreground">Rp {(stats.totalValue / 1000000).toFixed(1)}jt</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Stok Rendah</p>
                  <p className="text-2xl font-bold text-foreground">{stats.lowStock}</p>
                </div>
                <Package className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-1 gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Ikan Konsumsi">Ikan Konsumsi</SelectItem>
                <SelectItem value="Bibit Ikan">Bibit Ikan</SelectItem>
                <SelectItem value="Ikan Olahan">Ikan Olahan</SelectItem>
                <SelectItem value="Pakan Ikan">Pakan Ikan</SelectItem>
                <SelectItem value="Peralatan">Peralatan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchProducts}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Produk ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = '<svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                }}
                              />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {product.description || 'Tidak ada deskripsi'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>Rp {parseFloat(product.price).toLocaleString('id-ID')}</TableCell>
                      <TableCell>{parseFloat(product.stock_kg || product.stock || 0).toFixed(1)} kg</TableCell>
                      <TableCell>
                        {getStockBadge(product.stock_kg || product.stock)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProduct(product);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(product)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || selectedCategory !== 'all' 
                          ? 'Tidak ada produk yang cocok dengan filter' 
                          : 'Belum ada produk'}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <ProductForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSubmit={editingProduct ? handleEditProduct : handleCreateProduct}
          editData={editingProduct}
          loading={formLoading}
        />

        {/* Delete Confirmation */}
        <AlertDialog 
          open={!!deleteConfirm} 
          onOpenChange={() => setDeleteConfirm(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus produk <strong>{deleteConfirm?.name}</strong>? 
                Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
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
    </div>
  );
}
