import { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Loader2,
  ImageIcon,
  DollarSign,
  Box,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  getAllProducts,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";
import pondService from "@/services/pondService";
import { toast } from "sonner";
import { DashboardSidebar } from "@/layouts/DashboardSidebar";

// Form component for creating/editing products
const ProductForm = ({ isOpen, onClose, onSubmit, editData, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_kg: "",
    category: "Ikan Konsumsi",
    image_url: "",
    pond_id: "none", // Add pond_id with default "none"
  });

  const [errors, setErrors] = useState({});
  const [ponds, setPonds] = useState([]);
  const [loadingPonds, setLoadingPonds] = useState(false);

  // Fetch ponds when form opens
  useEffect(() => {
    if (isOpen) {
      const fetchPonds = async () => {
        setLoadingPonds(true);
        const result = await pondService.getAllPonds();
        if (result.success) {
          setPonds(result.data);
        }
        setLoadingPonds(false);
      };
      fetchPonds();
    }
  }, [isOpen]);

  // Reset form when modal opens/closes, based on editData
  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_kg: "",
        category: "Ikan Konsumsi",
        image_url: "",
        pond_id: "none",
      });
      setErrors({});
      return;
    }

    // When modal opens, populate form based on editData
    if (editData) {
      setFormData({
        name: editData.name || "",
        description: editData.description || "",
        price: editData.price || "",
        stock_kg: editData.stock_kg || editData.stock || "",
        category: editData.category || "Ikan Konsumsi",
        image_url: editData.image_url || "",
        pond_id: editData.pond_id ? editData.pond_id.toString() : "none",
      });
      setErrors({});
    } else {
      // Modal opened for creating new product
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_kg: "",
        category: "Ikan Konsumsi",
        image_url: "",
        pond_id: "none",
      });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editData?.id]); // Only depend on editData.id, not the whole object

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Nama produk harus minimal 3 karakter";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Harga harus lebih dari 0";
    }

    if (!formData.stock_kg || parseFloat(formData.stock_kg) < 0) {
      newErrors.stock_kg = "Stok tidak boleh negatif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    // Convert to proper types
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stock_kg: parseFloat(formData.stock_kg),
      pond_id: formData.pond_id === "none" ? null : parseInt(formData.pond_id),
    };

    onSubmit(submitData);
  };

  const categories = [
    "Ikan Konsumsi",
    "Bibit Ikan",
    "Ikan Olahan",
    "Pakan Ikan",
    "Peralatan",
  ];

  const handleOpenChange = (open) => {
    // Only close if explicitly set to false and not submitting
    if (!open && !loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          // Prevent closing when clicking on form elements
          const target = e.target;
          if (target.closest && target.closest("form")) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Produk" : "Tambah Produk Baru"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Perbarui informasi produk"
              : "Tambahkan produk baru ke katalog"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          autoComplete="on"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-2">
            <Label htmlFor="product-name">Nama Produk *</Label>
            <Input
              id="product-name"
              name="product-name"
              autoComplete="off"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Contoh: Nila Premium"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-description">Deskripsi</Label>
            <Input
              id="product-description"
              name="product-description"
              autoComplete="off"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Deskripsi produk..."
            />
            <p className="text-xs text-muted-foreground">
              Deskripsi produk (opsional)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-price">Harga (Rp/kg) *</Label>
              <Input
                id="product-price"
                name="product-price"
                type="number"
                step="0.01"
                min="0"
                autoComplete="off"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="50000"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-stock">Stok (kg) *</Label>
              <Input
                id="product-stock"
                name="product-stock"
                type="number"
                step="0.1"
                min="0"
                autoComplete="off"
                value={formData.stock_kg}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stock_kg: e.target.value }))
                }
                placeholder="100"
                className={errors.stock_kg ? "border-red-500" : ""}
              />
              {errors.stock_kg && (
                <p className="text-sm text-red-500">{errors.stock_kg}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-category">Kategori</Label>
            <Select
              name="product-category"
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger
                id="product-category"
                aria-label="Pilih kategori produk"
              >
                <SelectValue placeholder="Pilih kategori" />
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
            <Label htmlFor="product-pond">Kolam (Opsional)</Label>
            <Select
              name="product-pond"
              value={formData.pond_id || "none"}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  pond_id: value === "none" ? "none" : value,
                }))
              }
              disabled={loadingPonds}
            >
              <SelectTrigger
                id="product-pond"
                aria-label="Pilih kolam untuk produk"
              >
                <SelectValue
                  placeholder={
                    loadingPonds ? "Memuat kolam..." : "Pilih kolam (opsional)"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak ada kolam spesifik</SelectItem>
                {ponds.map((pond) => (
                  <SelectItem key={pond.id} value={pond.id.toString()}>
                    {pond.name} - {pond.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Pilih kolam jika produk berasal dari kolam tertentu
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-image">URL Gambar</Label>
            <Input
              id="product-image"
              name="product-image"
              type="url"
              autoComplete="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image_url: e.target.value }))
              }
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
              {editData ? "Perbarui" : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Simple Edit Form for Stock, Price, Description, Image URL, and Category
const EditProductDialog = ({ isOpen, onClose, product, onUpdate, loading }) => {
  const [formData, setFormData] = useState({
    price: "",
    stock_kg: "",
    description: "",
    image_url: "",
    category: "Ikan Konsumsi",
  });

  const [errors, setErrors] = useState({});

  const categories = [
    "Ikan Konsumsi",
    "Bibit Ikan",
    "Ikan Olahan",
    "Pakan Ikan",
    "Peralatan",
  ];

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        price: product.price || "",
        stock_kg: product.stock_kg || product.stock || "",
        description: product.description || "",
        image_url: product.image_url || "",
        category: product.category || "Ikan Konsumsi",
      });
      setErrors({});
    }
  }, [isOpen, product?.id]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Harga harus lebih dari 0";
    }

    if (formData.stock_kg === "" || parseFloat(formData.stock_kg) < 0) {
      newErrors.stock_kg = "Stok tidak boleh negatif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      price: parseFloat(formData.price),
      stock_kg: parseFloat(formData.stock_kg),
      category: formData.category,
    };

    // Only include description if it has a value or is explicitly cleared
    const trimmedDescription = formData.description.trim();
    if (trimmedDescription !== "") {
      submitData.description = trimmedDescription;
    } else {
      // If empty, send null to clear the description
      submitData.description = null;
    }

    // Include image_url if it has a value
    const trimmedImageUrl = formData.image_url.trim();
    if (trimmedImageUrl !== "") {
      submitData.image_url = trimmedImageUrl;
    } else {
      // If empty, send null to clear the image_url
      submitData.image_url = null;
    }

    onUpdate(product.id, submitData);
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Produk: {product.name}</DialogTitle>
          <DialogDescription>
            Dapat mengubah harga, stok, deskripsi, kategori, dan URL gambar
            produk
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Harga (Rp/kg) *</Label>
              <Input
                id="edit-price"
                name="edit-price"
                type="number"
                step="0.01"
                min="0"
                autoComplete="off"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="50000"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stok (kg) *</Label>
              <Input
                id="edit-stock"
                name="edit-stock"
                type="number"
                step="0.1"
                min="0"
                autoComplete="off"
                value={formData.stock_kg}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stock_kg: e.target.value,
                  }))
                }
                placeholder="100"
                className={errors.stock_kg ? "border-red-500" : ""}
              />
              {errors.stock_kg && (
                <p className="text-sm text-red-500">{errors.stock_kg}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Deskripsi</Label>
            <Input
              id="edit-description"
              name="edit-description"
              autoComplete="off"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Deskripsi produk..."
            />
            <p className="text-xs text-muted-foreground">
              Deskripsi produk (opsional)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Kategori</Label>
            <Select
              name="edit-category"
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger
                id="edit-category"
                aria-label="Pilih kategori produk"
              >
                <SelectValue placeholder="Pilih kategori" />
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
            <Label htmlFor="edit-image">URL Gambar</Label>
            <Input
              id="edit-image"
              name="edit-image"
              type="url"
              autoComplete="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  image_url: e.target.value,
                }))
              }
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Masukkan URL gambar produk (opsional, kosongkan untuk menghapus
              gambar)
            </p>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Produk:</strong> {product.name}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan Perubahan
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Edit states
  const [editProduct, setEditProduct] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setRefreshing(true);
      // Use getMyProducts() instead of getAllProducts() to filter by role
      // Admin will see all products, petambak will only see products from their pond
      const result = await getMyProducts();

      if (result.success) {
        setProducts(result.data);
      } else {
        toast.error(result.error || "Gagal memuat produk");
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
        toast.success(result.message || "Produk berhasil ditambahkan");
        setShowForm(false);
        fetchProducts();
      } else {
        toast.error(result.error || "Gagal menambahkan produk");
      }
    } catch (error) {
      toast.error("Gagal menambahkan produk");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (productId, updateData) => {
    try {
      setEditLoading(true);
      const result = await updateProduct(productId, updateData);

      if (result.success) {
        toast.success(result.message || "Produk berhasil diperbarui");
        setEditProduct(null);
        fetchProducts();
      } else {
        toast.error(result.error || "Gagal memperbarui produk");
      }
    } catch (error) {
      toast.error("Gagal memperbarui produk");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setDeleting(true);
      const result = await deleteProduct(productId);

      if (result.success) {
        toast.success(result.message || "Produk berhasil dihapus");
        setDeleteConfirm(null);
        fetchProducts();
      } else {
        toast.error(result.error || "Gagal menghapus produk");
      }
    } catch (error) {
      toast.error("Gagal menghapus produk");
    } finally {
      setDeleting(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const stats = {
    total: products.length,
    totalStock: products.reduce(
      (sum, p) => sum + parseFloat(p.stock_kg || p.stock || 0),
      0
    ),
    totalValue: products.reduce(
      (sum, p) =>
        sum + parseFloat(p.price || 0) * parseFloat(p.stock_kg || p.stock || 0),
      0
    ),
    lowStock: products.filter(
      (p) => parseFloat(p.stock_kg || p.stock || 0) < 20
    ).length,
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
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar
          onNavigate={onNavigate}
          currentPage="product-management"
        />
        <div className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
              <span>Memuat data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        onNavigate={onNavigate}
        currentPage="product-management"
      />
      <div className="flex-1 lg:ml-64">
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
                    <p className="text-muted-foreground text-sm">
                      Total Produk
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.total}
                    </p>
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
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalStock.toFixed(1)} kg
                    </p>
                  </div>
                  <Box className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Nilai Inventori
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      Rp {(stats.totalValue / 1000000).toFixed(1)}jt
                    </p>
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
                    <p className="text-2xl font-bold text-foreground">
                      {stats.lowStock}
                    </p>
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
                  id="search-products"
                  name="search-products"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                  aria-label="Cari produk"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                name="filter-category"
              >
                <SelectTrigger
                  id="filter-category"
                  className="w-[180px]"
                  aria-label="Filter kategori produk"
                >
                  <SelectValue placeholder="Filter kategori" />
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
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
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
                                    e.target.style.display = "none";
                                    e.target.parentElement.innerHTML =
                                      '<svg class="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                  }}
                                />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {product.description || "Tidak ada deskripsi"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          Rp {parseFloat(product.price).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          {parseFloat(
                            product.stock_kg || product.stock || 0
                          ).toFixed(1)}{" "}
                          kg
                        </TableCell>
                        <TableCell>
                          {getStockBadge(product.stock_kg || product.stock)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditProduct(product)}
                              className="text-blue-600 hover:text-blue-700"
                              aria-label={`Edit produk ${product.name}`}
                              title={`Edit harga dan stok ${product.name}`}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(product)}
                              className="text-red-600 hover:text-red-700"
                              aria-label={`Hapus produk ${product.name}`}
                              title={`Hapus produk ${product.name}`}
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
                          {searchTerm || selectedCategory !== "all"
                            ? "Tidak ada produk yang cocok dengan filter"
                            : "Belum ada produk"}
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
            }}
            onSubmit={handleCreateProduct}
            editData={null}
            loading={formLoading}
          />

          {/* Edit Dialog */}
          <EditProductDialog
            isOpen={!!editProduct}
            onClose={() => setEditProduct(null)}
            product={editProduct}
            onUpdate={handleUpdateProduct}
            loading={editLoading}
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
                  Apakah Anda yakin ingin menghapus produk{" "}
                  <strong>{deleteConfirm?.name}</strong>? Tindakan ini tidak
                  dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteProduct(deleteConfirm.id)}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
