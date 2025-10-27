import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  MapPin,
  Package,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { toast } from "sonner";
import { getProductById } from "@/services/productService";
import cartService from "@/services/cartService";
import { useAuth } from "@/contexts/AuthContext";

export function ProductDetailPage({ productId, onNavigate }) {
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product detail from backend
  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    setLoading(true);
    setError(null);

    const result = await getProductById(productId);

    if (result.success) {
      // Transform backend data to match frontend format
      const transformedProduct = {
        id: result.data.id,
        name: result.data.name,
        price: result.data.price,
        stock: result.data.stock_kg,
        category: result.data.category || "Ikan Konsumsi",
        image:
          result.data.image_url ||
          "https://images.unsplash.com/photo-1607629194532-53c98b8180da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaHxlbnwxfHx8fDE3NjA0NTExMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
        description:
          result.data.description ||
          "Ikan nila segar premium kualitas terbaik. Cocok untuk konsumsi keluarga atau restoran.",
        pond_name: result.data.pond_name || "Tidak ada info kolam",
        pond_location: result.data.pond_location || "-",
      };

      setProduct(transformedProduct);
    } else {
      setError(result.error);
      toast.error("Gagal memuat detail produk", {
        description: result.error,
      });
    }

    setLoading(false);
  };

  const handleQuantityChange = (value) => {
    const newQty = parseInt(value) || 1;
    if (newQty < 1) {
      setQuantity(1);
    } else if (newQty > product.stock) {
      setQuantity(product.stock);
      toast.warning("Stok tidak mencukupi", {
        description: `Maksimal ${product.stock} kg`,
      });
    } else {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Login diperlukan", {
        description:
          "Silakan login terlebih dahulu untuk menambahkan produk ke keranjang",
      });
      onNavigate("login");
      return;
    }

    if (user.role !== "buyer") {
      toast.error("Akses ditolak", {
        description: "Hanya buyer yang dapat menambahkan produk ke keranjang",
      });
      return;
    }

    setAddingToCart(true);

    const result = await cartService.addToCart(product.id, quantity);

    if (result.success) {
      toast.success("Produk ditambahkan!", {
        description: `${quantity} kg ${product.name} berhasil ditambahkan ke keranjang`,
        action: {
          label: "Lihat Keranjang",
          onClick: () => onNavigate("cart"),
        },
      });
    } else {
      toast.error("Gagal menambahkan ke keranjang", {
        description: result.error,
      });
    }

    setAddingToCart(false);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("products")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Produk
          </Button>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat detail produk...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("products")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Produk
          </Button>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-foreground mb-2">Produk Tidak Ditemukan</h3>
            <p className="text-muted-foreground mb-4">
              {error || "Produk yang Anda cari tidak tersedia"}
            </p>
            <Button onClick={() => onNavigate("products")}>
              Kembali ke Daftar Produk
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate("products")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Produk
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-muted aspect-square">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.stock === 0 && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 text-white">Habis</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-foreground mb-2">{product.name}</h1>

              {/* Pond Info */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">{product.pond_name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{product.pond_location}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p
                  className="text-muted-foreground mb-1"
                  style={{ fontSize: "0.875rem" }}
                >
                  Harga
                </p>
                <p
                  className="text-primary"
                  style={{ fontSize: "1.75rem", fontWeight: 700 }}
                >
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  per kg
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p
                  className="text-muted-foreground mb-1"
                  style={{ fontSize: "0.875rem" }}
                >
                  Stok Tersedia
                </p>
                <p
                  className="text-foreground"
                  style={{ fontSize: "1.75rem", fontWeight: 700 }}
                >
                  {product.stock}
                </p>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  kg
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-foreground mb-3">Jumlah (kg)</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-24 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <div className="ml-4">
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Total
                  </p>
                  <p
                    className="text-foreground"
                    style={{ fontSize: "1.25rem", fontWeight: 600 }}
                  >
                    Rp {(product.price * quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {addingToCart
                ? "Menambahkan..."
                : product.stock === 0
                ? "Stok Habis"
                : "Tambahkan ke Keranjang"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
