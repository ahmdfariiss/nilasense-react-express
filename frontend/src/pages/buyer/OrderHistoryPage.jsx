import { useState, useEffect } from "react";
import { Package, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import orderService from "@/services/orderService";

export function OrderHistoryPage({ onNavigate }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (user && user.role === "buyer") {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await orderService.getMyOrders();

      // Transform data from backend
      const transformedOrders = result.data.map((order) => ({
        id: order.id,
        order_number: order.order_number,
        created_at: order.created_at,
        status: order.status,
        payment_status: order.payment_status,
        total_amount: parseFloat(order.total_amount),
        items_count: order.item_count || 0,
        shipping_city: "", // Backend doesn't return city in list, will get from detail
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Gagal memuat riwayat pesanan", {
        description: error.message || "Terjadi kesalahan pada server",
      });
    } finally {
      setLoading(false);
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-foreground mb-6">Riwayat Pesanan</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat riwayat pesanan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-foreground mb-6">Riwayat Pesanan</h1>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cari nomor pesanan atau kota..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none z-10" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="paid">Dibayar</SelectItem>
                    <SelectItem value="processing">Diproses</SelectItem>
                    <SelectItem value="shipped">Dikirim</SelectItem>
                    <SelectItem value="delivered">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-foreground mb-2">
                {orders.length === 0 ? "Belum Ada Pesanan" : "Tidak Ada Hasil"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {orders.length === 0
                  ? "Mulai berbelanja dan buat pesanan pertama Anda"
                  : "Coba ubah filter atau kata kunci pencarian"}
              </p>
              <Button onClick={() => onNavigate("products")}>
                Lihat Produk
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate("order-detail", order.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-primary" />
                        <h3 className="text-foreground font-semibold">
                          {order.order_number}
                        </h3>
                        {getStatusBadge(order.status)}
                        {getPaymentBadge(order.payment_status)}
                      </div>
                      <p className="text-muted-foreground text-sm mb-1">
                        {formatDate(order.created_at)}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {order.items_count} item
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">
                          Total
                        </p>
                        <p className="text-primary font-bold text-xl">
                          Rp {order.total_amount.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate("order-detail", order.id);
                        }}
                      >
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
