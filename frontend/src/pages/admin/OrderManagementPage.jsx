import { useState, useEffect } from "react";
import { Package, Search, Filter, Eye, MapPin, CreditCard } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import orderService from "@/services/orderService";
import { DashboardSidebar } from "@/layouts/DashboardSidebar";

export function OrderManagementPage({ onNavigate }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "petambak")) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await orderService.getOrdersForAdmin();

      const transformedOrders = result.data.map((order) => ({
        id: order.id,
        order_number: order.order_number,
        created_at: order.created_at,
        status: order.status,
        payment_status: order.payment_status,
        total_amount: parseFloat(order.total_amount),
        buyer_name: order.buyer_name,
        buyer_email: order.buyer_email,
        item_count: order.item_count || 0,
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Gagal memuat daftar pesanan", {
        description: error.message || "Terjadi kesalahan pada server",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (order) => {
    try {
      const result = await orderService.getOrderById(order.id);

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
          product_name: item.product_name,
          product_price: parseFloat(item.product_price),
          quantity: item.quantity,
          subtotal: parseFloat(item.subtotal),
        })),
      };

      setSelectedOrder(transformedOrder);
      setNewStatus(transformedOrder.status);
      setAdminNotes(transformedOrder.admin_notes || "");
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching order detail:", error);
      toast.error("Gagal memuat detail pesanan", {
        description: error.message || "Terjadi kesalahan pada server",
      });
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error("Status harus dipilih");
      return;
    }

    setUpdating(true);
    try {
      const result = await orderService.updateOrderStatus(selectedOrder.id, {
        status: newStatus,
        admin_notes: adminNotes,
      });

      toast.success("Status pesanan berhasil diperbarui");

      // Close modal first
      setIsDialogOpen(false);
      setSelectedOrder(null);

      // Refresh the entire order list to get latest data
      await fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Gagal memperbarui status pesanan", {
        description: error.message || "Terjadi kesalahan pada server",
      });
    } finally {
      setUpdating(false);
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
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!user || (user.role !== "admin" && user.role !== "petambak")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-foreground mb-2">Akses Ditolak</h2>
            <p className="text-muted-foreground mb-6">
              Halaman ini hanya untuk admin dan petambak
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-foreground mb-6">Manajemen Pesanan</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat daftar pesanan...</p>
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
        currentPage="order-management"
      />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-foreground">Manajemen Pesanan</h1>
            {user.role === "petambak" && (
              <Badge variant="outline" className="text-sm">
                Hanya Kolam Anda
              </Badge>
            )}
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Cari nomor pesanan, nama atau email pembeli..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    id="search-orders"
                    name="search-orders"
                    aria-label="Cari pesanan"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none z-10" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger
                      className="pl-10"
                      id="filter-status"
                      aria-label="Filter status pesanan"
                    >
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

          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-foreground mb-2">
                  {orders.length === 0
                    ? "Belum Ada Pesanan"
                    : "Tidak Ada Hasil"}
                </h2>
                <p className="text-muted-foreground">
                  {orders.length === 0
                    ? user.role === "petambak"
                      ? "Belum ada pesanan untuk produk di kolam Anda"
                      : "Belum ada pesanan masuk"
                    : "Coba ubah filter atau kata kunci pencarian"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className="hover:shadow-lg transition-shadow"
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
                          <span className="font-medium">Pembeli:</span>{" "}
                          {order.buyer_name || order.buyer_email}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {order.item_count} item
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
                          size="sm"
                          onClick={() => handleViewDetail(order)}
                          aria-label={`Lihat detail pesanan ${order.order_number}`}
                          title={`Lihat detail pesanan ${order.order_number}`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Order Detail Dialog - 2 COLUMNS */}
          <Dialog open={isDialogOpen} onOpenChange={() => {}}>
            <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detail Pesanan</DialogTitle>
                <DialogDescription>
                  Detail informasi pesanan dan update status
                </DialogDescription>
              </DialogHeader>

              {selectedOrder && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                  {/* LEFT COLUMN */}
                  <div className="space-y-3">
                    {/* Order Info */}
                    <div className="border rounded-lg p-3 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Informasi Pesanan
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Nomor</p>
                          <p className="font-medium">
                            {selectedOrder.order_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Tanggal
                          </p>
                          <p>{formatDate(selectedOrder.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Pembayaran
                          </p>
                          <p>
                            {selectedOrder.payment_method === "manual_transfer"
                              ? "Transfer"
                              : "COD"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Status
                          </p>
                          {getPaymentBadge(selectedOrder.payment_status)}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="border rounded-lg p-3 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Pengiriman
                      </h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="text-muted-foreground">
                            Penerima:
                          </span>{" "}
                          {selectedOrder.shipping_name} (
                          {selectedOrder.shipping_phone})
                        </p>
                        <p className="text-muted-foreground">
                          {selectedOrder.shipping_address},{" "}
                          {selectedOrder.shipping_city}{" "}
                          {selectedOrder.shipping_postal_code}
                        </p>
                        {selectedOrder.notes && (
                          <p className="text-xs italic text-blue-600 dark:text-blue-400 pt-1">
                            Catatan: "{selectedOrder.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="space-y-3">
                    {/* Order Items */}
                    <div className="border rounded-lg p-3 space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Produk
                      </h4>
                      <div className="space-y-1">
                        {selectedOrder.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm py-1"
                          >
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.quantity} kg × Rp{" "}
                                {item.product_price.toLocaleString("id-ID")}
                              </p>
                            </div>
                            <p className="font-semibold">
                              Rp {item.subtotal.toLocaleString("id-ID")}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>
                            Rp {selectedOrder.subtotal.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ongkir</span>
                          <span className="text-green-600">GRATIS</span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-1 border-t">
                          <span>Total</span>
                          <span className="text-primary">
                            Rp{" "}
                            {selectedOrder.total_amount.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Update Status */}
                    <div className="border-2 border-primary rounded-lg p-3 space-y-2 bg-primary/5">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Update Status
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <label
                            htmlFor="order-status"
                            className="text-xs font-medium block mb-1"
                          >
                            Status Pesanan
                          </label>
                          <Select
                            value={newStatus}
                            onValueChange={setNewStatus}
                          >
                            <SelectTrigger id="order-status">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Menunggu</SelectItem>
                              <SelectItem value="paid">Dibayar</SelectItem>
                              <SelectItem value="processing">
                                Diproses
                              </SelectItem>
                              <SelectItem value="shipped">Dikirim</SelectItem>
                              <SelectItem value="delivered">Selesai</SelectItem>
                              <SelectItem value="cancelled">
                                Dibatalkan
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label
                            htmlFor="admin-notes"
                            className="text-xs font-medium block mb-1"
                          >
                            Catatan Admin
                          </label>
                          <Textarea
                            id="admin-notes"
                            name="admin-notes"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Catatan opsional..."
                            rows={2}
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button
                            onClick={handleUpdateStatus}
                            disabled={updating}
                            className="flex-1"
                          >
                            {updating ? "Menyimpan..." : "Simpan"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={updating}
                          >
                            Tutup
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
