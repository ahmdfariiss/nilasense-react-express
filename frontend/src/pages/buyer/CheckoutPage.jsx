import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import cartService from "@/services/cartService";
import orderService from "@/services/orderService";

export function CheckoutPage({ onNavigate }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    shipping_name: "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_postal_code: "",
    payment_method: "manual_transfer",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && user.role === "buyer") {
      // Set default shipping name from user
      setFormData((prev) => ({
        ...prev,
        shipping_name: user.name || "",
      }));
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);

    const result = await cartService.getCart();

    if (result.success) {
      // Transform backend data
      const transformedItems = result.data.map((item) => ({
        id: item.cart_id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.price,
        product_image: item.image_url,
        pond_name: item.pond_name,
        quantity_kg: item.quantity,
      }));

      setCartItems(transformedItems);

      // Redirect to cart if empty
      if (transformedItems.length === 0) {
        toast.info("Keranjang kosong", {
          description: "Silakan tambahkan produk terlebih dahulu",
        });
        setTimeout(() => {
          onNavigate("products");
        }, 1500);
      }
    } else {
      toast.error("Gagal memuat keranjang", {
        description: result.error,
      });
    }

    setLoading(false);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product_price * item.quantity_kg,
      0
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shipping_name.trim()) {
      newErrors.shipping_name = "Nama penerima harus diisi";
    }

    if (!formData.shipping_phone.trim()) {
      newErrors.shipping_phone = "Nomor telepon harus diisi";
    } else if (!/^[\d\s\-+()]+$/.test(formData.shipping_phone)) {
      newErrors.shipping_phone = "Nomor telepon tidak valid";
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = "Alamat pengiriman harus diisi";
    }

    if (!formData.shipping_city.trim()) {
      newErrors.shipping_city = "Kota harus diisi";
    }

    if (!formData.shipping_postal_code.trim()) {
      newErrors.shipping_postal_code = "Kode pos harus diisi";
    }

    if (!formData.payment_method) {
      newErrors.payment_method = "Metode pembayaran harus dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Form tidak lengkap", {
        description: "Silakan lengkapi semua field yang wajib diisi",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }

    setSubmitting(true);

    // Prepare order data for backend
    const orderData = {
      shipping_name: formData.shipping_name,
      shipping_phone: formData.shipping_phone,
      shipping_address: formData.shipping_address,
      shipping_city: formData.shipping_city,
      shipping_postal_code: formData.shipping_postal_code,
      payment_method: formData.payment_method,
      notes: formData.notes || "",
    };

    const result = await orderService.createOrder(orderData);

    if (result.success) {
      toast.success("Pesanan berhasil dibuat!", {
        description: `Nomor pesanan: ${result.data.order.order_number}`,
      });

      // Navigate to order history
      setTimeout(() => {
        onNavigate("order-history");
      }, 1500);
    } else {
      toast.error("Gagal membuat pesanan", {
        description: result.error,
      });
    }

    setSubmitting(false);
  };

  // Check login and role
  if (!user || user.role !== "buyer") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-foreground mb-2">Akses Ditolak</h2>
            <p className="text-muted-foreground mb-6">
              Halaman ini hanya untuk pembeli yang sudah login
            </p>
            <Button onClick={() => onNavigate("login")} className="w-full">
              Login
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
          <h1 className="text-foreground mb-6">Checkout</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("cart")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Keranjang
          </Button>

          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-foreground mb-2">Keranjang Kosong</h2>
              <p className="text-muted-foreground mb-6">
                Tambahkan produk ke keranjang terlebih dahulu
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate("cart")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Keranjang
        </Button>

        <h1 className="text-foreground mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping & Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Alamat Pengiriman
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shipping_name">
                      Nama Penerima <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shipping_name"
                      placeholder="Nama lengkap penerima"
                      value={formData.shipping_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping_name: e.target.value,
                        })
                      }
                      className={
                        errors.shipping_name ? "border-destructive" : ""
                      }
                    />
                    {errors.shipping_name && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shipping_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="shipping_phone">
                      Nomor Telepon <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shipping_phone"
                      type="tel"
                      placeholder="081234567890"
                      value={formData.shipping_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping_phone: e.target.value,
                        })
                      }
                      className={
                        errors.shipping_phone ? "border-destructive" : ""
                      }
                    />
                    {errors.shipping_phone && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shipping_phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="shipping_address">
                      Alamat Lengkap <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="shipping_address"
                      placeholder="Jl. Contoh No. 123, RT/RW 01/02"
                      value={formData.shipping_address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping_address: e.target.value,
                        })
                      }
                      className={
                        errors.shipping_address ? "border-destructive" : ""
                      }
                      rows={3}
                    />
                    {errors.shipping_address && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.shipping_address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shipping_city">
                        Kota <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="shipping_city"
                        placeholder="Jakarta"
                        value={formData.shipping_city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shipping_city: e.target.value,
                          })
                        }
                        className={
                          errors.shipping_city ? "border-destructive" : ""
                        }
                      />
                      {errors.shipping_city && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.shipping_city}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="shipping_postal_code">
                        Kode Pos <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="shipping_postal_code"
                        placeholder="12345"
                        value={formData.shipping_postal_code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shipping_postal_code: e.target.value,
                          })
                        }
                        className={
                          errors.shipping_postal_code
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.shipping_postal_code && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.shipping_postal_code}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Metode Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="payment_method">
                      Pilih Metode <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(value) =>
                        setFormData({ ...formData, payment_method: value })
                      }
                    >
                      <SelectTrigger
                        id="payment_method"
                        className={
                          errors.payment_method ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Pilih metode pembayaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual_transfer">
                          Transfer Bank
                        </SelectItem>
                        <SelectItem value="cash_on_delivery">
                          Bayar di Tempat (COD)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.payment_method && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.payment_method}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes">Catatan (Opsional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Tambahkan catatan untuk pesanan Anda"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <ImageWithFallback
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground line-clamp-2">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.quantity_kg} kg × Rp{" "}
                            {item.product_price.toLocaleString("id-ID")}
                          </p>
                          <p className="text-sm text-primary font-semibold mt-1">
                            Rp{" "}
                            {(
                              item.product_price * item.quantity_kg
                            ).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal ({cartItems.length} item)
                      </span>
                      <span className="text-foreground">
                        Rp {calculateTotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Biaya Pengiriman
                      </span>
                      <span className="text-green-600 font-medium">GRATIS</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-foreground font-semibold">Total</span>
                    <span className="text-primary font-bold text-xl">
                      Rp {calculateTotal().toLocaleString("id-ID")}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Buat Pesanan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
