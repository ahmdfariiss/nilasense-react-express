import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Phone,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import orderService from "@/services/orderService";

export function OrderDetailPage({ orderId, onNavigate }) {
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (user && user.role === "buyer" && orderId) {
      fetchOrderDetail();
    } else {
      setLoading(false);
    }
  }, [user, orderId]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const result = await orderService.getOrderById(orderId);

      // Transform data from backend
      const transformedOrder = {
        id: result.data.id,
        order_number: result.data.order_number,
        created_at: result.data.created_at,
        status: result.data.status,
        payment_status: result.data.payment_status,
        payment_method: result.data.payment_method,
        total_amount: parseFloat(result.data.total_amount),
        subtotal: parseFloat(result.data.subtotal),
        shipping_cost: parseFloat(result.data.shipping_cost),
        shipping_name: result.data.shipping_name,
        shipping_phone: result.data.shipping_phone,
        shipping_address: result.data.shipping_address,
        shipping_city: result.data.shipping_city,
        shipping_postal_code: result.data.shipping_postal_code,
        notes: result.data.notes,
        admin_notes: result.data.admin_notes,
        items: result.data.items.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_price: parseFloat(item.product_price),
          product_image: item.product_image,
          quantity: item.quantity,
          subtotal: parseFloat(item.subtotal),
        })),
      };

      setOrder(transformedOrder);
    } catch (error) {
      console.error("Error fetching order detail:", error);
      toast.error("Gagal memuat detail pesanan", {
        description: error.message || "Terjadi kesalahan pada server",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (order.status !== "pending") {
      toast.error("Pesanan tidak dapat dibatalkan", {
        description:
          "Hanya pesanan dengan status 'Menunggu' yang dapat dibatalkan",
      });
      return;
    }

    setCancelling(true);
    try {
      await orderService.cancelOrder(orderId, {
        reason: "Dibatalkan oleh pembeli",
      });

      toast.success("Pesanan dibatalkan", {
        description: "Pesanan Anda berhasil dibatalkan",
      });

      // Update order status
      setOrder({ ...order, status: "cancelled" });
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Gagal membatalkan pesanan", {
        description: error.message || "Terjadi kesalahan pada server",
      });
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Menunggu",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      paid: {
        label: "Dibayar",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      processing: {
        label: "Diproses",
        className: "bg-purple-100 text-purple-800 border-purple-200",
      },
      shipped: {
        label: "Dikirim",
        className: "bg-cyan-100 text-cyan-800 border-cyan-200",
      },
      delivered: {
        label: "Selesai",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      cancelled: {
        label: "Dibatalkan",
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    if (paymentStatus === "paid") {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-200"
        >
          Dibayar
        </Badge>
      );
    } else if (paymentStatus === "unpaid") {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 border-yellow-200"
        >
          Belum Bayar
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 border-gray-200"
        >
          Refund
        </Badge>
      );
    }
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      cash_on_delivery: "Bayar di Tempat (COD)",
      bank_transfer: "Transfer Bank",
      e_wallet: "E-Wallet",
    };
    return methods[method] || method;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canCancelOrder = () => {
    return (
      order && (order.status === "pending" || order.status === "confirmed")
    );
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
          <Button
            variant="ghost"
            onClick={() => onNavigate("order-history")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Riwayat Pesanan
          </Button>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat detail pesanan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("order-history")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Riwayat Pesanan
          </Button>
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-foreground mb-2">Pesanan Tidak Ditemukan</h2>
              <p className="text-muted-foreground mb-6">
                Pesanan yang Anda cari tidak ditemukan atau sudah dihapus
              </p>
              <Button onClick={() => onNavigate("order-history")}>
                Lihat Riwayat Pesanan
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
          onClick={() => onNavigate("order-history")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Riwayat Pesanan
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="mb-2">{order.order_number}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.payment_status)}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Produk Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground font-medium mb-1">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {item.quantity} kg × Rp{" "}
                        {item.product_price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-semibold">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Alamat Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-foreground">{order.shipping_address}</p>
                  <p className="text-muted-foreground">
                    {order.shipping_city}, {order.shipping_postal_code}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{order.shipping_phone}</span>
                  </div>
                  {order.notes && (
                    <>
                      <Separator className="my-3" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Catatan:
                        </p>
                        <p className="text-foreground">{order.notes}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="w-5 h-5" />
                    Metode Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">
                    {getPaymentMethodLabel(order.payment_method)}
                  </p>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Ringkasan Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({order.items.length} item)
                    </span>
                    <span className="text-foreground">
                      Rp {order.total_amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Biaya Pengiriman
                    </span>
                    <span className="text-green-600 font-medium">GRATIS</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-foreground font-semibold">Total</span>
                    <span className="text-primary font-bold text-xl">
                      Rp {order.total_amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Cancel Order Button */}
              {canCancelOrder() && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={cancelling}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Batalkan Pesanan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Batalkan Pesanan?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin membatalkan pesanan ini?
                        Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Tidak</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelOrder}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Ya, Batalkan
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
