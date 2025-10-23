import { useState, useEffect } from "react";
import {
  Calendar,
  Download,
  RefreshCw,
  Droplet,
  ArrowLeft,
  Home,
  ChevronRight,
  UtensilsCrossed,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import monitoringService from "../services/monitoringService";
import pondService from "../services/pondService";
import { toast } from "sonner";

// Empty state component
const EmptyState = ({ message, onRefresh }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Data</h3>
    <p className="text-muted-foreground mb-6 max-w-md">
      {message || "Belum ada data monitoring untuk kolam ini. Data akan muncul setelah sensor mulai mengirim data."}
    </p>
    <Button onClick={onRefresh} variant="outline">
      <RefreshCw className="w-4 h-4 mr-2" />
      Coba Lagi
    </Button>
  </div>
);

// Loading component
const LoadingState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
    <p className="text-muted-foreground">{message || "Memuat data..."}</p>
  </div>
);

export function WaterQualityPage({ onBack, showBreadcrumb = false, onNavigate }) {
  // State management
  const [timeRange, setTimeRange] = useState("7");
  const [chartData, setChartData] = useState([]);
  const [waterHistoryData, setWaterHistoryData] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch ponds on component mount
  useEffect(() => {
    fetchPonds();
  }, []);

  // Fetch monitoring data when pond is selected
  useEffect(() => {
    if (selectedPond) {
      fetchMonitoringData();
    }
  }, [selectedPond, timeRange]);

  const fetchPonds = async () => {
    try {
      setLoading(true);
      const result = await pondService.getAccessiblePonds();
      
      if (result.success) {
        setPonds(result.data);
        
        // Set default pond
        const defaultPond = pondService.getDefaultPond(result.data);
        if (defaultPond) {
          setSelectedPond(defaultPond);
        } else if (result.data.length === 0) {
          setError("Belum ada kolam yang tersedia. Silakan hubungi admin untuk menambahkan kolam.");
        }
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError("Gagal memuat data kolam");
      toast.error("Gagal memuat data kolam");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonitoringData = async () => {
    if (!selectedPond) return;
    
    try {
      setRefreshing(true);
      setError(null);

      // Calculate date range based on timeRange
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      // Fetch monitoring logs
      const result = await monitoringService.getWaterQualityByDateRange(
        selectedPond.id,
        startDate.toISOString(),
        endDate.toISOString()
      );

      if (result.success) {
        const logs = result.data;
        
        // Format data for charts
        const formattedChartData = monitoringService.formatChartData(logs);
        setChartData(formattedChartData);
        
        // Format data for history table (limit to 10 recent entries)
        const historyData = logs.slice(0, 10).map(log => ({
          time: new Date(log.logged_at).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          date: new Date(log.logged_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          suhu: `${log.temperature}°C`,
          ph: log.ph_level.toString(),
          kekeruhan: `${log.turbidity} NTU`,
          oksigen: `${log.dissolved_oxygen} mg/L`,
          status: getOverallStatus(log)
        }));
        setWaterHistoryData(historyData);
        
        // Set current status from latest data
        if (logs.length > 0) {
          const latest = logs[0];
          setCurrentStatus({
            suhu: { 
              value: `${latest.temperature}°C`, 
              status: monitoringService.getWaterQualityStatus(latest.temperature, 'temperature'),
              min: 25, 
              max: 30 
            },
            ph: { 
              value: latest.ph_level.toString(), 
              status: monitoringService.getWaterQualityStatus(latest.ph_level, 'ph_level'),
              min: 6.5, 
              max: 8.5 
            },
            kekeruhan: { 
              value: `${latest.turbidity} NTU`, 
              status: monitoringService.getWaterQualityStatus(latest.turbidity, 'turbidity'),
              max: 25 
            },
            oksigen: { 
              value: `${latest.dissolved_oxygen} mg/L`, 
              status: monitoringService.getWaterQualityStatus(latest.dissolved_oxygen, 'dissolved_oxygen'),
              min: 5.0 
            },
          });
        } else {
          setCurrentStatus(null);
        }
      } else {
        setError(result.message);
        if (result.message !== 'Belum ada data monitoring') {
          toast.error(result.message);
        }
      }
    } catch (err) {
      setError("Gagal memuat data monitoring");
      toast.error("Gagal memuat data monitoring");
    } finally {
      setRefreshing(false);
    }
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  const handlePondChange = (pondId) => {
    const pond = ponds.find(p => p.id.toString() === pondId);
    if (pond) {
      setSelectedPond(pond);
      pondService.saveSelectedPond(pondId);
    }
  };

  const handleRefresh = () => {
    fetchMonitoringData();
  };

  const getOverallStatus = (log) => {
    const statuses = [
      monitoringService.getWaterQualityStatus(log.temperature, 'temperature'),
      monitoringService.getWaterQualityStatus(log.ph_level, 'ph_level'),
      monitoringService.getWaterQualityStatus(log.dissolved_oxygen, 'dissolved_oxygen'),
      monitoringService.getWaterQualityStatus(log.turbidity, 'turbidity')
    ];

    if (statuses.includes('warning')) return 'Perhatian';
    if (statuses.includes('good')) return 'Sangat Baik';
    return 'Normal';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "good":
        return <Badge className="bg-[#10b981] text-white">Sangat Baik</Badge>;
      case "normal":
        return <Badge className="bg-[#0891b2] text-white">Normal</Badge>;
      case "warning":
        return <Badge className="bg-[#f59e0b] text-white">Perhatian</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState message="Memuat data kolam..." />
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !selectedPond) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState message={error} onRefresh={fetchPonds} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Home className="w-4 h-4" />
              <span>Monitoring Kolam</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Kualitas Air</span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-foreground mb-2">Monitoring Kualitas Air</h1>
              <p className="text-muted-foreground">
                Pantau kondisi kualitas air kolam Anda secara real-time
              </p>
            </div>
            
            {/* Pond Selector */}
            {ponds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Kolam:</span>
                <Select
                  value={selectedPond?.id.toString()}
                  onValueChange={handlePondChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Pilih kolam" />
                  </SelectTrigger>
                  <SelectContent>
                    {ponds.map((pond) => (
                      <SelectItem key={pond.id} value={pond.id.toString()}>
                        {pond.name}
                        {pond.location && (
                          <span className="text-muted-foreground ml-2">
                            ({pond.location})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          {/* Quick Navigation */}
          {onNavigate && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate("monitoring")}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate("feed-schedule")}
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Jadwal Pakan
              </Button>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Memuat...' : 'Refresh Data'}
            </Button>
            <Button variant="outline" size="sm" disabled={!chartData.length}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Current Status Cards */}
        {!currentStatus ? (
          <div className="mb-8">
            <EmptyState 
              message="Belum ada data monitoring untuk kolam ini. Data akan muncul setelah sensor mulai mengirim data."
              onRefresh={handleRefresh}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-[#0891b2]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-muted-foreground">Suhu Air</p>
                <Droplet className="w-5 h-5 text-[#0891b2]" />
              </div>
              <p
                className="text-foreground mb-2"
                style={{ fontSize: "2rem", fontWeight: 700 }}
              >
                {currentStatus.suhu.value}
              </p>
              {getStatusBadge(currentStatus.suhu.status)}
              <p
                className="text-muted-foreground mt-2"
                style={{ fontSize: "0.75rem" }}
              >
                Rentang: {currentStatus.suhu.min}°C -{" "}
                {currentStatus.suhu.max}°C
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#10b981]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-muted-foreground">pH Air</p>
                <Droplet className="w-5 h-5 text-[#10b981]" />
              </div>
              <p
                className="text-foreground mb-2"
                style={{ fontSize: "2rem", fontWeight: 700 }}
              >
                {currentStatus.ph.value}
              </p>
              {getStatusBadge(currentStatus.ph.status)}
              <p
                className="text-muted-foreground mt-2"
                style={{ fontSize: "0.75rem" }}
              >
                Rentang: {currentStatus.ph.min} - {currentStatus.ph.max}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#06b6d4]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-muted-foreground">Oksigen Terlarut</p>
                <Droplet className="w-5 h-5 text-[#06b6d4]" />
              </div>
              <p
                className="text-foreground mb-2"
                style={{ fontSize: "2rem", fontWeight: 700 }}
              >
                {currentStatus.oksigen.value}
              </p>
              {getStatusBadge(currentStatus.oksigen.status)}
              <p
                className="text-muted-foreground mt-2"
                style={{ fontSize: "0.75rem" }}
              >
                Minimal: {currentStatus.oksigen.min} mg/L
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#8b5cf6]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-muted-foreground">Kekeruhan</p>
                <Droplet className="w-5 h-5 text-[#8b5cf6]" />
              </div>
              <p
                className="text-foreground mb-2"
                style={{ fontSize: "2rem", fontWeight: 700 }}
              >
                {currentStatus.kekeruhan.value}
              </p>
              {getStatusBadge(currentStatus.kekeruhan.status)}
              <p
                className="text-muted-foreground mt-2"
                style={{ fontSize: "0.75rem" }}
              >
                Maksimal: {currentStatus.kekeruhan.max} NTU
              </p>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Charts Section */}
        {currentStatus && chartData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Temperature Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Grafik Suhu Air</CardTitle>
                <Select
                  value={timeRange}
                  onValueChange={handleTimeRangeChange}
                >
                  <SelectTrigger className="w-[140px]">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Hari Ini</SelectItem>
                    <SelectItem value="7">7 Hari</SelectItem>
                    <SelectItem value="30">30 Hari</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#64748b"
                      style={{ fontSize: "12px" }}
                      domain={[24, 32]}
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
                      strokeWidth={3}
                      name="Suhu (°C)"
                      dot={{ fill: "#0891b2", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* pH Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Grafik pH Air</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#64748b"
                      style={{ fontSize: "12px" }}
                      domain={[6, 8.5]}
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
                      dataKey="ph"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="pH"
                      dot={{ fill: "#10b981", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Turbidity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Grafik Kekeruhan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#64748b"
                      style={{ fontSize: "12px" }}
                      domain={[0, 30]}
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
                      dataKey="kekeruhan"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      name="Kekeruhan (NTU)"
                      dot={{ fill: "#8b5cf6", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Oxygen Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Grafik Oksigen Terlarut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#64748b"
                      style={{ fontSize: "12px" }}
                      domain={[4, 9]}
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
                      dataKey="oksigen"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      name="Oksigen (mg/L)"
                      dot={{ fill: "#06b6d4", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        ) : currentStatus && chartData.length === 0 ? (
          <div className="mb-8">
            <EmptyState 
              message="Belum ada data historis untuk rentang waktu yang dipilih."
              onRefresh={handleRefresh}
            />
          </div>
        ) : null}

        {/* History Table */}
        {currentStatus && (
          <Card>
          <CardHeader>
            <CardTitle>Riwayat Data Monitoring</CardTitle>
            <p
              className="text-muted-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              Data monitoring terbaru dari sensor IoT
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Suhu</TableHead>
                    <TableHead>pH</TableHead>
                    <TableHead>Kekeruhan</TableHead>
                    <TableHead>Oksigen</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waterHistoryData.length > 0 ? (
                    waterHistoryData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.suhu}</TableCell>
                        <TableCell>{row.ph}</TableCell>
                        <TableCell>{row.kekeruhan}</TableCell>
                        <TableCell>{row.oksigen}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              row.status === 'Sangat Baik' ? "bg-[#10b981] text-white" :
                              row.status === 'Normal' ? "bg-[#0891b2] text-white" :
                              "bg-[#f59e0b] text-white"
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-muted-foreground">
                          Belum ada data monitoring
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}