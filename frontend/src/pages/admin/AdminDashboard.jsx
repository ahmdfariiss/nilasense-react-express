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
  const [mlPrediction, setMlPrediction] = useState(null); // ML prediction untuk dashboard
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
              product: order.first_product_name || "-",
              qty: order.total_quantity ? `${order.total_quantity} kg` : "-",
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

      // Fetch latest water quality dengan ML prediction
      const waterResult = await monitoringService.getLatestWaterQuality(pondId);
      if (waterResult.success && waterResult.data) {
        setWaterQualityData(waterResult.data);
        // Set ML prediction jika tersedia
        if (waterResult.mlPrediction) {
          setMlPrediction(waterResult.mlPrediction);
        } else {
          setMlPrediction(null);
        }
      } else {
        setWaterQualityData(null);
        setMlPrediction(null);
      }

      // Fetch water quality trend (7 days) - juga akan dapat ML prediction
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Last 7 days untuk lebih banyak data

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

        // Update ML prediction dari trend result jika tidak ada dari latest
        if (!mlPrediction && trendResult.mlPrediction) {
          setMlPrediction(trendResult.mlPrediction);
        }
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

    // Prioritaskan hasil ML prediction jika tersedia
    if (mlPrediction && mlPrediction.quality) {
      return mlPrediction.quality;
    }

    // Fallback ke rule-based calculation jika ML tidak tersedia
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
    if (statuses.every((s) => s === "good")) return "Baik";
    return "Normal";
  };

  const getMLQualityBadge = (quality) => {
    if (!quality) return null;

    const qualityLower = quality.toLowerCase();
    if (qualityLower === "baik") {
      return <Badge className="bg-[#10b981] text-white">Baik</Badge>;
    } else if (qualityLower === "normal") {
      return <Badge className="bg-[#0891b2] text-white">Normal</Badge>;
    } else if (
      qualityLower.includes("perhatian") ||
      qualityLower.includes("buruk")
    ) {
      return <Badge className="bg-[#f59e0b] text-white">Perlu Perhatian</Badge>;
    }
    return <Badge variant="outline">{quality}</Badge>;
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
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar
          onNavigate={onNavigate}
          currentPage="admin-dashboard"
        />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar onNavigate={onNavigate} currentPage="admin-dashboard" />
      <div className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-foreground text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Dashboard Overview</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Selamat datang kembali! Berikut ringkasan kondisi tambak Anda
                hari ini.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full sm:w-auto"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Pond Selection */}
          {ponds.length > 0 && (
            <Card className="mb-4 sm:mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-primary hidden sm:block" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card className="border-l-4 border-l-[#0891b2]">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Status Kualitas Air
                        {mlPrediction && (
                          <span className="ml-1 sm:ml-2 text-xs hidden sm:inline">(ML Prediction)</span>
                        )}
                      </p>
                      <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-[#0891b2]" />
                    </div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <p className="text-foreground text-lg sm:text-xl md:text-2xl font-bold">
                        {getWaterQualityStatus()}
                      </p>
                      {mlPrediction && getMLQualityBadge(mlPrediction.quality)}
                    </div>
                    {mlPrediction && mlPrediction.confidence && (
                      <p className="text-muted-foreground mb-2 text-xs sm:text-sm">
                        Confidence: {(mlPrediction.confidence * 100).toFixed(2)}%
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      {waterQualityData ? (
                        <>
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#10b981]" />
                          <span className="text-[#10b981] text-xs sm:text-sm">
                            Data terbaru tersedia
                            <span className="hidden sm:inline">{mlPrediction ? " • ML Analysis" : " • Rule-based"}</span>
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#f59e0b]" />
                          <span className="text-[#f59e0b] text-xs sm:text-sm">
                            Belum ada data
                          </span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#f59e0b]">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Jadwal Pakan Berikutnya
                      </p>
                      <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b]" />
                    </div>
                    <p className="text-foreground text-lg sm:text-xl md:text-2xl font-bold">
                      {getNextFeedTime()}
                    </p>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {feedSummary?.nextFeedTime
                        ? `Pukul ${feedSummary.nextFeedTime.substring(0, 5)} WIB`
                        : "Belum ada jadwal"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#10b981]">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-muted-foreground text-xs sm:text-sm">Pesanan Baru</p>
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />
                    </div>
                    <p className="text-foreground text-lg sm:text-xl md:text-2xl font-bold">
                      {recentOrders.filter((o) => o.status !== "Selesai").length}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        Menunggu diproses
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#8b5cf6]">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-muted-foreground text-xs sm:text-sm">Stok Produk</p>
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b5cf6]" />
                    </div>
                    <p className="text-foreground text-lg sm:text-xl md:text-2xl font-bold">
                      {productsStats ? `${productsStats.totalStock.toFixed(0)} kg` : "N/A"}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {productsStats && productsStats.lowStock > 0 ? (
                        <>
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#f59e0b]" />
                          <span className="text-[#f59e0b] text-xs sm:text-sm">
                            {productsStats.lowStock} produk stok rendah
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#10b981]" />
                          <span className="text-[#10b981] text-xs sm:text-sm">
                            Stok aman
                          </span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Water Quality Trend Chart */}
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Tren Kualitas Air (24 Jam)</CardTitle>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Monitoring suhu dan pH air secara real-time
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    {waterQualityTrend.length > 0 ? (
                      <div className="h-48 sm:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={waterQualityTrend}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e2e8f0"
                            />
                            <XAxis
                              dataKey="date"
                              stroke="#64748b"
                              style={{ fontSize: "10px" }}
                              tick={{ fontSize: 10 }}
                            />
                            <YAxis
                              stroke="#64748b"
                              style={{ fontSize: "10px" }}
                              tick={{ fontSize: 10 }}
                              width={30}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                fontSize: "12px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="suhu"
                              stroke="#0891b2"
                              strokeWidth={2}
                              name="Suhu (°C)"
                              dot={{ fill: "#0891b2", r: 2 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="ph"
                              stroke="#10b981"
                              strokeWidth={2}
                              name="pH"
                              dot={{ fill: "#10b981", r: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-48 sm:h-64 flex items-center justify-center">
                        <div className="text-center">
                          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground text-sm">
                            Belum ada data monitoring
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-4 justify-center">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#0891b2]" />
                        <span className="text-muted-foreground text-xs sm:text-sm">
                          Suhu (°C)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#10b981]" />
                        <span className="text-muted-foreground text-xs sm:text-sm">
                          pH
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ML Prediction & AI Analysis Card */}
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      {mlPrediction
                        ? "Analisis ML Kualitas Air"
                        : "Analisis Tren Kualitas Air"}
                    </CardTitle>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {mlPrediction
                        ? "Hasil prediksi Machine Learning berdasarkan data terbaru"
                        : "Berdasarkan data monitoring terkini"}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    {mlPrediction ? (
                      <>
                        {/* ML Prediction Summary */}
                        <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
                          {/* Quality & Confidence */}
                          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                Kualitas Air
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <p className="text-base sm:text-lg font-bold">
                                  {mlPrediction.quality}
                                </p>
                                {getMLQualityBadge(mlPrediction.quality)}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                Confidence
                              </p>
                              <p className="text-base sm:text-lg font-bold text-primary">
                                {(mlPrediction.confidence * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>

                          {/* Issues Summary */}
                          {mlPrediction.issues &&
                            mlPrediction.issues.length > 0 && (
                              <div className="p-2.5 sm:p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                <p className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-amber-900 dark:text-amber-200">
                                  Masalah Terdeteksi:
                                </p>
                                <ul className="space-y-1">
                                  {mlPrediction.issues
                                    .slice(0, 3)
                                    .map((issue, idx) => (
                                      <li
                                        key={idx}
                                        className="text-xs sm:text-sm text-amber-800 dark:text-amber-300"
                                      >
                                        • {issue}
                                      </li>
                                    ))}
                                  {mlPrediction.issues.length > 3 && (
                                    <li className="text-xs text-amber-600 dark:text-amber-400">
                                      +{mlPrediction.issues.length - 3} masalah lainnya
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}

                          {/* Top Recommendations */}
                          {mlPrediction.recommendations &&
                            mlPrediction.recommendations.length > 0 && (
                              <div className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-900 dark:text-blue-200">
                                  Rekomendasi Utama:
                                </p>
                                <ol className="space-y-1">
                                  {mlPrediction.recommendations
                                    .slice(0, 2)
                                    .map((rec, idx) => (
                                      <li
                                        key={idx}
                                        className="text-xs sm:text-sm text-blue-800 dark:text-blue-300"
                                      >
                                        {idx + 1}. {rec}
                                      </li>
                                    ))}
                                  {mlPrediction.recommendations.length > 2 && (
                                    <li className="text-xs text-blue-600 dark:text-blue-400">
                                      +{mlPrediction.recommendations.length - 2} rekomendasi lainnya
                                    </li>
                                  )}
                                </ol>
                              </div>
                            )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {aiPredictions.map((prediction, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/50 rounded-lg gap-2"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground text-sm sm:text-base mb-0.5 sm:mb-1 truncate">
                                {prediction.parameter}
                              </p>
                              <p className="text-muted-foreground text-xs sm:text-sm truncate">
                                {prediction.prediction}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                              {prediction.trend === "increasing" && (
                                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b]" />
                              )}
                              {prediction.trend === "decreasing" && (
                                <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ef4444]" />
                              )}
                              {prediction.trend === "stable" && (
                                <div className="w-3.5 sm:w-4 h-0.5 bg-[#10b981]" />
                              )}
                              <Badge
                                className={`${getStatusColor(prediction.status)} text-xs`}
                              >
                                {prediction.status === "good" ? "Baik" : "Perhatian"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full mt-3 sm:mt-4 text-xs sm:text-sm"
                      onClick={() => onNavigate("water-monitoring")}
                    >
                      <span className="hidden sm:inline">Lihat Detail Monitoring & Analisis Lengkap</span>
                      <span className="sm:hidden">Lihat Detail Monitoring</span>
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-base sm:text-lg">Pesanan Terbaru</CardTitle>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        5 pesanan terakhir yang masuk
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => onNavigate("orders")}
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      Lihat Semua
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-muted-foreground">
                      <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Belum ada pesanan masuk</p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden sm:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs sm:text-sm">ID Pesanan</TableHead>
                              <TableHead className="text-xs sm:text-sm">Pelanggan</TableHead>
                              <TableHead className="text-xs sm:text-sm">Produk</TableHead>
                              <TableHead className="text-xs sm:text-sm">Jumlah</TableHead>
                              <TableHead className="text-xs sm:text-sm">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {recentOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="text-xs sm:text-sm font-medium">{order.id}</TableCell>
                                <TableCell className="text-xs sm:text-sm">{order.customer}</TableCell>
                                <TableCell className="text-xs sm:text-sm">{order.product}</TableCell>
                                <TableCell className="text-xs sm:text-sm">{order.qty}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={`${getOrderStatusColor(order.status)} text-xs`}
                                  >
                                    {order.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="sm:hidden space-y-3">
                        {recentOrders.map((order) => (
                          <div
                            key={order.id}
                            className="p-3 bg-muted/30 rounded-lg border"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-primary">{order.id}</span>
                              <Badge
                                variant="outline"
                                className={`${getOrderStatusColor(order.status)} text-xs`}
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex justify-between">
                                <span className="text-xs text-muted-foreground">Pelanggan</span>
                                <span className="text-xs font-medium truncate ml-2 max-w-[150px]">{order.customer}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-muted-foreground">Produk</span>
                                <span className="text-xs font-medium truncate ml-2 max-w-[150px]">{order.product}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-muted-foreground">Jumlah</span>
                                <span className="text-xs font-medium">{order.qty}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
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
