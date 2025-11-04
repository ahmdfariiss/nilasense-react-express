import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/common/ProductCard";
import { Footer } from "@/layouts/Footer";
import { toast } from "sonner";
import { getAllProducts } from "@/services/productService";
import { motion, AnimatePresence } from "framer-motion";

export function ProductsPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPond, setSelectedPond] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
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

    const result = await getAllProducts();

    if (result.success) {
      // Transform backend data to match frontend format
      const transformedProducts = result.data.map((product) => ({
        id: product.id,
        name: product.name,
        farmer: "Petambak Terverifikasi", // Default value karena backend tidak punya field ini
        price: product.price,
        stock: product.stock_kg,
        stock_kg: product.stock_kg, // For stock badge check
        category: product.category || "Ikan Konsumsi",
        image:
          product.image_url ||
          "https://images.unsplash.com/photo-1607629194532-53c98b8180da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaHxlbnwxfHx8fDE3NjA0NTExMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
        waterQuality: "Baik", // Default value
        description: product.description || "",
        pond_name: product.pond_name || null, // ← Tambahkan ini
        pond_location: product.pond_location || null, // ← Tambahkan ini
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

  // Extract unique pond names and locations for filters
  const uniquePonds = [
    ...new Set(products.map((p) => p.pond_name).filter(Boolean)),
  ];
  const uniqueLocations = [
    ...new Set(products.map((p) => p.pond_location).filter(Boolean)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesPond =
      selectedPond === "all" || product.pond_name === selectedPond;
    const matchesLocation =
      selectedLocation === "all" || product.pond_location === selectedLocation;
    return matchesSearch && matchesCategory && matchesPond && matchesLocation;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const slideDownVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const productCardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.h1
            className="text-foreground mb-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Pasar Ikan Nila
          </motion.h1>
          <motion.p className="text-muted-foreground" variants={itemVariants}>
            Temukan ikan nila berkualitas dengan transparansi data monitoring
            yang lengkap
          </motion.p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="mb-8 space-y-4"
          variants={slideDownVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari produk atau petambak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap gap-3">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              disabled={loading}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kategori" />
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

            <Select
              value={selectedPond}
              onValueChange={setSelectedPond}
              disabled={loading || uniquePonds.length === 0}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kolam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kolam</SelectItem>
                {uniquePonds.map((pond) => (
                  <SelectItem key={pond} value={pond}>
                    {pond}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
              disabled={loading || uniqueLocations.length === 0}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Lokasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Lokasi</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

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
        <AnimatePresence mode="wait">
          {!loading && !error && filteredProducts.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key="products-grid"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={productCardVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  layout
                >
                  <ProductCard product={product} onNavigate={onNavigate} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State - No Results */}
        <AnimatePresence>
          {!loading &&
            !error &&
            filteredProducts.length === 0 &&
            products.length > 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <Search className="w-10 h-10 text-muted-foreground" />
                </motion.div>
                <motion.h3
                  className="text-foreground mb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Produk tidak ditemukan
                </motion.h3>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Coba ubah kata kunci pencarian atau filter yang dipilih
                </motion.p>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Empty State - No Products */}
        <AnimatePresence>
          {!loading && !error && products.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-4xl">📦</span>
              </motion.div>
              <motion.h3
                className="text-foreground mb-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Belum Ada Produk
              </motion.h3>
              <motion.p
                className="text-muted-foreground"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Produk akan ditampilkan di sini setelah ditambahkan
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
