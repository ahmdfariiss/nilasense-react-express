import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import cartService from "@/services/cartService";

export function CartPage({ onNavigate }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "buyer") {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);

    const result = await cartService.getCart();

    if (result.success) {
      // Transform backend data to match frontend format
      const transformedItems = result.data.map((item) => ({
        id: item.cart_id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.price,
        product_image: item.image_url,
        pond_name: item.pond_name,
        pond_location: item.pond_location,
        quantity_kg: item.quantity,
        stock_available: item.stock,
        category: item.category,
      }));

      setCartItems(transformedItems);
    } else {
      toast.error("Gagal memuat keranjang", {
        description: result.error,
      });
    }

    setLoading(false);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const item = cartItems.find((i) => i.id === itemId);

    if (newQuantity < 1) {
      toast.warning("Jumlah minimal 1 kg");
      return;
    }

    if (newQuantity > item.stock_available) {
      toast.warning("Stok tidak mencukupi", {
        description: `Maksimal ${item.stock_available} kg`,
      });
      return;
    }

    const result = await cartService.updateCartItem(itemId, newQuantity);

    if (result.success) {
      // Update local state
      setCartItems(
        cartItems.map((i) =>
          i.id === itemId ? { ...i, quantity_kg: newQuantity } : i
        )
      );
      toast.success("Jumlah diperbarui");
    } else {
      toast.error("Gagal memperbarui jumlah", {
        description: result.error,
      });
    }
  };

  const removeItem = async (itemId) => {
    const result = await cartService.removeFromCart(itemId);

    if (result.success) {
      setCartItems(cartItems.filter((i) => i.id !== itemId));
      toast.success("Produk dihapus dari keranjang");
    } else {
      toast.error("Gagal menghapus produk", {
        description: result.error,
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product_price * item.quantity_kg,
      0
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }
    onNavigate("checkout");
  };

  // Check login and role
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-foreground mb-2">Login Diperlukan</h2>
            <p className="text-muted-foreground mb-6">
              Silakan login untuk melihat keranjang belanja Anda
            </p>
            <Button onClick={() => onNavigate("login")} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "buyer") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-foreground mb-2">Akses Ditolak</h2>
            <p className="text-muted-foreground mb-6">
              Halaman ini hanya untuk pembeli
            </p>
            <Button onClick={() => onNavigate("home")} className="w-full">
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-foreground mb-6">Keranjang Belanja</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat keranjang...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-foreground mb-6">Keranjang Belanja</h1>
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-foreground mb-2">Keranjang Anda Kosong</h2>
              <p className="text-muted-foreground mb-6">
                Mulai berbelanja dan tambahkan produk ke keranjang
              </p>
              <Button onClick={() => onNavigate("products")}>
                Lihat Produk
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Cart with Items
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-foreground mb-6">Keranjang Belanja</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1">
                        {item.product_name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {item.pond_name} • {item.pond_location}
                      </p>
                      <p className="text-primary font-semibold">
                        Rp {item.product_price.toLocaleString("id-ID")} / kg
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity_kg - 1)
                          }
                          disabled={item.quantity_kg <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          max={item.stock_available}
                          value={item.quantity_kg}
                          onChange={(e) =>
                            updateQuantity(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 h-8 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity_kg + 1)
                          }
                          disabled={item.quantity_kg >= item.stock_available}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm text-muted-foreground ml-2">
                          {item.quantity_kg} kg
                        </span>
                      </div>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="text-right flex flex-col justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Subtotal
                        </p>
                        <p className="text-foreground font-semibold">
                          Rp{" "}
                          {(
                            item.product_price * item.quantity_kg
                          ).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-foreground mb-4">Ringkasan Pesanan</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({cartItems.length} item)
                    </span>
                    <span className="text-foreground">
                      Rp {calculateTotal().toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Biaya Pengiriman
                    </span>
                    <span className="text-green-600 font-medium">GRATIS</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="text-foreground font-semibold">Total</span>
                  <span className="text-primary font-bold text-xl">
                    Rp {calculateTotal().toLocaleString("id-ID")}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleCheckout}
                >
                  Lanjutkan ke Pembayaran
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => onNavigate("products")}
                >
                  Lanjut Belanja
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
