import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Droplet,
  UtensilsCrossed,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Waves,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import pondService from "@/services/pondService";
import monitoringService from "@/services/monitoringService";
import feedService from "@/services/feedService";
import { getAllProducts } from "@/services/productService";
import orderService from "@/services/orderService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebar } from "@/layouts/DashboardSidebar";

export function AdminDashboard({ onNavigate }) {
  const { user } = useAuth();

  // State untuk data
  const [ponds, setPonds] = useState([]);
  const [selectedPondId, setSelectedPondId] = useState(null);
  const [waterQualityData, setWaterQualityData] = useState(null);
  const [waterQualityTrend, setWaterQualityTrend] = useState([]);
  const [feedSummary, setFeedSummary] = useState(null);
  const [productsStats, setProductsStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (selectedPondId) {
      fetchPondSpecificData(selectedPondId);
    }
  }, [selectedPondId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch ponds
      const pondsResult = await pondService.getAllPonds();
      if (pondsResult.success && pondsResult.data.length > 0) {
        setPonds(pondsResult.data);

        // Auto-select first pond
        const defaultPond = pondService.getDefaultPond(pondsResult.data);
        if (defaultPond) {
          setSelectedPondId(defaultPond.id);
        }
      }

      // Fetch products stats
      const productsResult = await getAllProducts();
      if (productsResult.success) {
        const totalStock = productsResult.data.reduce(
          (sum, p) => sum + parseFloat(p.stock_kg || 0),
          0
        );
        const lowStock = productsResult.data.filter(
          (p) => parseFloat(p.stock_kg || 0) < 20
        ).length;
        setProductsStats({
          totalStock,
          lowStock,
          totalProducts: productsResult.data.length,
        });
      }

      // Fetch recent orders (5 latest)
      try {
        const ordersResult = await orderService.getOrdersForAdmin();
        if (ordersResult.success && ordersResult.data) {
          // Transform and take only 5 latest orders
          const transformedOrders = ordersResult.data
            .slice(0, 5)
            .map((order) => ({
              id: order.order_number,
              customer: order.buyer_name || order.shipping_name,
              product:
                order.items && order.items.length > 0
                  ? order.items[0].product_name
                  : "-",
              qty:
                order.items && order.items.length > 0
                  ? `${order.items[0].quantity} kg`
                  : "-",
              status: getStatusLabel(order.status),
            }));
          setRecentOrders(transformedOrders);
        }
      } catch (orderError) {
        console.error("Error fetching orders:", orderError);
        // Don't show error toast for orders, just use empty array
        setRecentOrders([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to translate status
  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Menunggu",
      paid: "Dibayar",
      processing: "Diproses",
      shipped: "Dikirim",
      delivered: "Selesai",
      cancelled: "Dibatalkan",
    };
    return statusMap[status] || status;
  };

  const fetchPondSpecificData = async (pondId) => {
    try {
      setRefreshing(true);

      // Fetch latest water quality
      const waterResult = await monitoringService.getLatestWaterQuality(pondId);
      if (waterResult.success && waterResult.data) {
        setWaterQualityData(waterResult.data);
      }

      // Fetch water quality trend (7 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1); // Last 24 hours

      const trendResult = await monitoringService.getWaterQualityByDateRange(
        pondId,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );

      if (trendResult.success && trendResult.data.length > 0) {
        const formattedTrend = monitoringService.formatChartData(
          trendResult.data
        );
        // Take last 10 data points for cleaner chart
        setWaterQualityTrend(formattedTrend.slice(-10));
      }

      // Fetch today's feed summary
      const feedResult = await feedService.getTodayFeedSummary(pondId);
      if (feedResult.success) {
        setFeedSummary(feedResult.data);
      }
    } catch (error) {
      console.error("Error fetching pond data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    if (selectedPondId) {
      fetchPondSpecificData(selectedPondId);
    }
  };

  const handlePondChange = (pondId) => {
    setSelectedPondId(parseInt(pondId));
    pondService.saveSelectedPond(pondId);
  };

  const getWaterQualityStatus = () => {
    if (!waterQualityData) return "Tidak Ada Data";

    const temp = parseFloat(waterQualityData.temperature);
    const ph = parseFloat(waterQualityData.ph_level);
    const oxygen = parseFloat(waterQualityData.dissolved_oxygen);
    const turbidity = parseFloat(waterQualityData.turbidity);

    const tempStatus = monitoringService.getWaterQualityStatus(
      temp,
      "temperature"
    );
    const phStatus = monitoringService.getWaterQualityStatus(ph, "ph_level");
    const oxygenStatus = monitoringService.getWaterQualityStatus(
      oxygen,
      "dissolved_oxygen"
    );
    const turbidityStatus = monitoringService.getWaterQualityStatus(
      turbidity,
      "turbidity"
    );

    const statuses = [tempStatus, phStatus, oxygenStatus, turbidityStatus];

    if (statuses.includes("warning")) return "Perlu Perhatian";
    if (statuses.every((s) => s === "good")) return "Sangat Baik";
    return "Baik";
  };

  const getNextFeedTime = () => {
    if (!feedSummary || !feedSummary.nextFeedTime) return "Tidak Ada Jadwal";

    const now = new Date();
    const [hours, minutes] = feedSummary.nextFeedTime.split(":").map(Number);
    const feedTime = new Date(now);
    feedTime.setHours(hours, minutes, 0, 0);

    const diffMs = feedTime - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0) return "Sudah Lewat";
    if (diffHours > 0) return `${diffHours} Jam ${diffMins} Menit`;
    return `${diffMins} Menit`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "good":
        return "bg-[#10b981] text-white";
      case "warning":
        return "bg-[#f59e0b] text-white";
      case "danger":
        return "bg-[#ef4444] text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20";
      case "Diproses":
        return "bg-[#0891b2]/10 text-[#0891b2] border-[#0891b2]/20";
      default:
        return "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20";
    }
  };

  // Generate AI predictions based on real data trends
  const generateAIPredictions = () => {
    if (!waterQualityData || waterQualityTrend.length < 3) {
      return [
        {
          parameter: "Data Monitoring",
          prediction: "Belum cukup data untuk prediksi",
          status: "warning",
          trend: "stable",
        },
      ];
    }

    const stats = monitoringService.getStatistics(
      waterQualityTrend.map((d) => ({
        temperature: d.temperature,
        ph_level: d.ph_level,
        dissolved_oxygen: d.dissolved_oxygen,
        turbidity: d.turbidity,
      }))
    );

    return [
      {
        parameter: "Oksigen Terlarut",
        prediction:
          stats.trends.dissolved_oxygen === "increasing"
            ? "Meningkat"
            : stats.trends.dissolved_oxygen === "decreasing"
            ? "Menurun"
            : "Stabil",
        status:
          stats.trends.dissolved_oxygen === "decreasing" ? "warning" : "good",
        trend: stats.trends.dissolved_oxygen,
      },
      {
        parameter: "pH Air",
        prediction:
          stats.trends.ph_level === "increasing"
            ? "Cenderung Naik"
            : stats.trends.ph_level === "decreasing"
            ? "Cenderung Turun"
            : "Stabil",
        status: stats.trends.ph_level === "stable" ? "good" : "warning",
        trend: stats.trends.ph_level,
      },
      {
        parameter: "Suhu Air",
        prediction:
          stats.trends.temperature === "increasing"
            ? "Cenderung Naik"
            : stats.trends.temperature === "decreasing"
            ? "Cenderung Turun"
            : "Stabil",
        status: stats.trends.temperature === "stable" ? "good" : "warning",
        trend: stats.trends.temperature,
      },
      {
        parameter: "Kekeruhan",
        prediction:
          stats.trends.turbidity === "increasing"
            ? "Meningkat"
            : stats.trends.turbidity === "decreasing"
            ? "Menurun"
            : "Stabil",
        status: stats.trends.turbidity === "increasing" ? "warning" : "good",
        trend: stats.trends.turbidity,
      },
    ];
  };

  const aiPredictions = generateAIPredictions();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar onNavigate={onNavigate} currentPage="admin-dashboard" />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-foreground mb-2">Dashboard Overview</h1>
              <p className="text-muted-foreground">
                Selamat datang kembali! Berikut ringkasan kondisi tambak Anda
                hari ini.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Pond Selection */}
          {ponds.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Waves className="w-6 h-6 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">
                      Kolam yang dipantau
                    </p>
                    <Select
                      value={selectedPondId?.toString()}
                      onValueChange={handlePondChange}
                    >
                      <SelectTrigger className="w-full md:w-[300px]">
                        <SelectValue placeholder="Pilih kolam" />
                      </SelectTrigger>
                      <SelectContent>
                        {ponds.map((pond) => (
                          <SelectItem key={pond.id} value={pond.id.toString()}>
                            {pond.name} - {pond.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {ponds.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Belum Ada Kolam</h3>
                <p className="text-muted-foreground mb-4">
                  Tambahkan kolam terlebih dahulu untuk mulai monitoring
                </p>
                <Button onClick={() => onNavigate("pond-management")}>
                  <Waves className="w-4 h-4 mr-2" />
                  Kelola Kolam
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Main Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-l-4 border-l-[#0891b2]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-muted-foreground">
                        Status Kualitas Air
                      </p>
                      <Droplet className="w-5 h-5 text-[#0891b2]" />
                    </div>
                    <p
                      className="text-foreground"
                      style={{ fontSize: "1.75rem", fontWeight: 700 }}
                    >
                      {getWaterQualityStatus()}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {waterQualityData ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-[#10b981]" />
                          <span
                            className="text-[#10b981]"
                            style={{ fontSize: "0.875rem" }}
                          >
                            Data terbaru tersedia
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
                          <span
                            className="text-[#f59e0b]"
                            style={{ fontSize: "0.875rem" }}
                          >
                            Belum ada data
                          </span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#f59e0b]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-muted-foreground">
                        Jadwal Pakan Berikutnya
                      </p>
                      <UtensilsCrossed className="w-5 h-5 text-[#f59e0b]" />
                    </div>
                    <p
                      className="text-foreground"
                      style={{ fontSize: "1.75rem", fontWeight: 700 }}
                    >
                      {getNextFeedTime()}
                    </p>
                    <p
                      className="text-muted-foreground"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {feedSummary?.nextFeedTime
                        ? `Pukul ${feedSummary.nextFeedTime.substring(
                            0,
                            5
                          )} WIB`
                        : "Belum ada jadwal"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#10b981]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-muted-foreground">Pesanan Baru</p>
                      <ShoppingBag className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <p
                      className="text-foreground"
                      style={{ fontSize: "1.75rem", fontWeight: 700 }}
                    >
                      {
                        recentOrders.filter((o) => o.status !== "Selesai")
                          .length
                      }
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span
                        className="text-muted-foreground"
                        style={{ fontSize: "0.875rem" }}
                      >
                        Menunggu diproses
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#8b5cf6]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-muted-foreground">Stok Produk</p>
                      <Package className="w-5 h-5 text-[#8b5cf6]" />
                    </div>
                    <p
                      className="text-foreground"
                      style={{ fontSize: "1.75rem", fontWeight: 700 }}
                    >
                      {productsStats
                        ? `${productsStats.totalStock.toFixed(0)} kg`
                        : "N/A"}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {productsStats && productsStats.lowStock > 0 ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-[#f59e0b]" />
                          <span
                            className="text-[#f59e0b]"
                            style={{ fontSize: "0.875rem" }}
                          >
                            {productsStats.lowStock} produk stok rendah
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-[#10b981]" />
                          <span
                            className="text-[#10b981]"
                            style={{ fontSize: "0.875rem" }}
                          >
                            Stok aman
                          </span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Water Quality Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tren Kualitas Air (24 Jam)</CardTitle>
                    <p
                      className="text-muted-foreground"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Monitoring suhu dan pH air secara real-time
                    </p>
                  </CardHeader>
                  <CardContent>
                    {waterQualityTrend.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={waterQualityTrend}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e2e8f0"
                            />
                            <XAxis
                              dataKey="date"
                              stroke="#64748b"
                              style={{ fontSize: "12px" }}
                            />
                            <YAxis
                              stroke="#64748b"
                              style={{ fontSize: "12px" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="suhu"
                              stroke="#0891b2"
                              strokeWidth={2}
                              name="Suhu (°C)"
                              dot={{ fill: "#0891b2", r: 3 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="ph"
                              stroke="#10b981"
                              strokeWidth={2}
                              name="pH"
                              dot={{ fill: "#10b981", r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            Belum ada data monitoring
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-4 mt-4 justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#0891b2]" />
                        <span
                          className="text-muted-foreground"
                          style={{ fontSize: "0.875rem" }}
                        >
                          Suhu (°C)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                        <span
                          className="text-muted-foreground"
                          style={{ fontSize: "0.875rem" }}
                        >
                          pH
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Prediction Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Analisis Tren Kualitas Air
                    </CardTitle>
                    <p
                      className="text-muted-foreground"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Berdasarkan data monitoring terkini
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiPredictions.map((prediction, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-foreground mb-1">
                              {prediction.parameter}
                            </p>
                            <p
                              className="text-muted-foreground"
                              style={{ fontSize: "0.875rem" }}
                            >
                              {prediction.prediction}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {prediction.trend === "increasing" && (
                              <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
                            )}
                            {prediction.trend === "decreasing" && (
                              <TrendingDown className="w-4 h-4 text-[#ef4444]" />
                            )}
                            {prediction.trend === "stable" && (
                              <div className="w-4 h-0.5 bg-[#10b981]" />
                            )}
                            <Badge
                              className={getStatusColor(prediction.status)}
                            >
                              {prediction.status === "good"
                                ? "Baik"
                                : "Perhatian"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => onNavigate("water-monitoring")}
                    >
                      Lihat Detail Monitoring
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Pesanan Terbaru</CardTitle>
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: "0.875rem" }}
                      >
                        5 pesanan terakhir yang masuk
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => onNavigate("orders")}
                    >
                      Lihat Semua
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>Belum ada pesanan masuk</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Pesanan</TableHead>
                          <TableHead>Pelanggan</TableHead>
                          <TableHead>Produk</TableHead>
                          <TableHead>Jumlah</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.product}</TableCell>
                            <TableCell>{order.qty}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getOrderStatusColor(order.status)}
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
