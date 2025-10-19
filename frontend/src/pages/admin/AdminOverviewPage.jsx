import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplet,
  UtensilsCrossed,
  Package,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  RefreshCw,
  Clock,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import AdminLayout from "@/components/layouts/AdminLayout";
import dashboardService from "@/services/dashboardService";

// Loading skeleton component
function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ title, description, onRetry }) {
  return (
    <div className="text-center py-12">
      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Coba Lagi
        </Button>
      )}
    </div>
  );
}

export function AdminOverviewPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Dashboard data states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [waterQualityOverview, setWaterQualityOverview] = useState(null);
  const [feedScheduleOverview, setFeedScheduleOverview] = useState(null);
  const [waterQualityTrend, setWaterQualityTrend] = useState([]);

  // Load all dashboard data
  const loadDashboardData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const [stats, waterOverview, feedOverview, trendData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getWaterQualityOverview(),
        dashboardService.getFeedScheduleOverview(),
        dashboardService.getWaterQualityTrend(null, 24)
      ]);

      setDashboardStats(stats);
      setWaterQualityOverview(waterOverview);
      setFeedScheduleOverview(feedOverview);
      setWaterQualityTrend(trendData);

      if (showToast) {
        toast.success("Dashboard berhasil diperbarui");
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Gagal memuat data dashboard');
      if (showToast) {
        toast.error("Gagal memperbarui dashboard");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return "border-l-green-500";
      case 'warning':
        return "border-l-yellow-500";
      case 'danger':
        return "border-l-red-500";
      default:
        return "border-l-gray-500";
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard Overview" subtitle="Selamat datang kembali! Berikut ringkasan kondisi tambak Anda hari ini.">
        <DashboardLoading />
      </AdminLayout>
    );
  }

  if (error && !dashboardStats) {
    return (
      <AdminLayout title="Dashboard Overview" subtitle="Selamat datang kembali! Berikut ringkasan kondisi tambak Anda hari ini.">
        <EmptyState
          title="Gagal Memuat Dashboard"
          description={error}
          onRetry={() => loadDashboardData()}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard Overview" subtitle="Selamat datang kembali! Berikut ringkasan kondisi tambak Anda hari ini.">
      {/* Refresh Button */}
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Memperbarui...' : 'Perbarui Data'}
        </Button>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Water Quality Status */}
        <Card className={`border-l-4 ${getStatusColor(waterQualityOverview?.overallStatus)}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Status Kualitas Air</p>
              <Droplet className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-2">
              {dashboardService.getStatusText(waterQualityOverview?.overallStatus)}
            </p>
            <div className="flex items-center gap-1">
              {getStatusIcon(waterQualityOverview?.overallStatus)}
              <span className="text-sm text-muted-foreground">
                {waterQualityOverview?.statusCounts?.good || 0} kolam normal
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Next Feeding */}
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Jadwal Pakan Berikutnya</p>
              <UtensilsCrossed className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-2">
              {feedScheduleOverview?.nextFeedingTime 
                ? dashboardService.formatTimeUntil(feedScheduleOverview.nextFeedingTime.timeUntil)
                : 'Tidak Ada'
              }
            </p>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {feedScheduleOverview?.nextFeedingTime 
                  ? `${feedScheduleOverview.nextFeedingTime.pondName} - ${feedScheduleOverview.nextFeedingTime.feed_time}`
                  : 'Semua selesai hari ini'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Feed Schedule Today */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Jadwal Pakan Hari Ini</p>
              <UtensilsCrossed className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-2">
              {feedScheduleOverview?.completedToday || 0}/{feedScheduleOverview?.totalSchedulesToday || 0}
            </p>
            <div className="flex items-center gap-1">
              {feedScheduleOverview?.completedToday === feedScheduleOverview?.totalSchedulesToday ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingUp className="w-4 h-4 text-blue-600" />
              )}
              <span className="text-sm text-muted-foreground">
                {feedScheduleOverview?.pendingToday || 0} tersisa
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Product Stock */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Stok Produk</p>
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-2">
              {dashboardStats?.totalStock || 0} kg
            </p>
            <div className="flex items-center gap-1">
              {dashboardStats?.lowStockCount > 0 ? (
                <>
                  <TrendingDown className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-600">
                    {dashboardStats.lowStockCount} produk stok rendah
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    Stok mencukupi
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
            <p className="text-sm text-muted-foreground">
              Monitoring suhu dan pH air secara real-time dari semua kolam
            </p>
          </CardHeader>
          <CardContent>
            {waterQualityTrend.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waterQualityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
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
                  <Droplet className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Belum ada data monitoring</p>
                </div>
              </div>
            )}
            <div className="flex gap-4 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-sm text-muted-foreground">Suhu (°C)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <span className="text-sm text-muted-foreground">pH</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pond Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Status Kolam
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ringkasan kondisi semua kolam budidaya
            </p>
          </CardHeader>
          <CardContent>
            {waterQualityOverview?.pondStatuses?.length > 0 ? (
              <div className="space-y-3">
                {waterQualityOverview.pondStatuses.slice(0, 5).map((pond, index) => (
                  <div
                    key={pond.pondId}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">
                        {pond.pondName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pond.lastUpdate 
                          ? `Update: ${new Date(pond.lastUpdate).toLocaleString('id-ID')}`
                          : 'Belum ada data'
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(pond.status)}
                      <Badge className={dashboardService.getStatusColor(pond.status)}>
                        {dashboardService.getStatusText(pond.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {waterQualityOverview.pondStatuses.length > 5 && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground">
                      +{waterQualityOverview.pondStatuses.length - 5} kolam lainnya
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Droplet className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Belum ada kolam terdaftar</p>
              </div>
            )}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/water-monitoring')}
            >
              Lihat Detail Monitoring
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/feed-management')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <UtensilsCrossed className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Kelola Jadwal Pakan</h3>
                <p className="text-sm text-muted-foreground">Atur dan pantau jadwal pemberian pakan</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/water-monitoring')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Droplet className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Monitoring Air</h3>
                <p className="text-sm text-muted-foreground">Pantau kualitas air secara real-time</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/products')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Kelola Produk</h3>
                <p className="text-sm text-muted-foreground">Tambah dan edit produk yang dijual</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminOverviewPage;