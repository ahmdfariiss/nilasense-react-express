import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ProductCard } from "../components/common/ProductCard";
import { toast } from "sonner";
import productService from "../services/productService";

export function ProductsPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    const result = await productService.getAllProducts();

    if (result.success) {
      // Transform backend data to match frontend format
      const transformedProducts = result.data.map((product) => ({
        id: product.id,
        name: product.name,
        farmer: "Petambak Terverifikasi", // Default value karena backend tidak punya field ini
        price: product.price,
        stock: product.stock_kg,
        category: product.category || "Ikan Konsumsi",
        image:
          product.image_url ||
          "https://images.unsplash.com/photo-1607629194532-53c98b8180da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaHxlbnwxfHx8fDE3NjA0NTExMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
        waterQuality: "Baik", // Default value
        description: product.description || "",
      }));

      setProducts(transformedProducts);
    } else {
      setError(result.error);
      toast.error("Gagal memuat produk", {
        description: result.error,
      });
    }

    setLoading(false);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Pasar Ikan Nila</h1>
          <p className="text-muted-foreground">
            Temukan ikan nila berkualitas dengan transparansi data monitoring
            yang lengkap
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari produk atau petambak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              disabled={loading}
            >
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Ikan Konsumsi">Ikan Konsumsi</SelectItem>
                <SelectItem value="Bibit Ikan">Bibit Ikan</SelectItem>
                <SelectItem value="Ikan Olahan">Ikan Olahan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat produk...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-foreground mb-2">Gagal Memuat Produk</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="text-primary hover:underline"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}

        {/* Empty State - No Results */}
        {!loading &&
          !error &&
          filteredProducts.length === 0 &&
          products.length > 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-foreground mb-2">Produk tidak ditemukan</h3>
              <p className="text-muted-foreground">
                Coba ubah kata kunci pencarian atau filter kategori
              </p>
            </div>
          )}

        {/* Empty State - No Products */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-foreground mb-2">Belum Ada Produk</h3>
            <p className="text-muted-foreground">
              Produk akan ditampilkan di sini setelah ditambahkan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
