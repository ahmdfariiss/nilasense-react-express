import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Droplet,
  UtensilsCrossed,
  Package,
  ShoppingBag,
  Users,
  Calendar,
  Download,
  RefreshCw,
  Waves,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import monitoringService from "@/services/monitoringService";
import pondService from "@/services/pondService";
import { toast } from "sonner";
import { DashboardSidebar } from "@/layouts/DashboardSidebar";

// Form untuk menambahkan log manual
const AddLogForm = ({ isOpen, onClose, onSubmit, pondId, loading }) => {
  const [formData, setFormData] = useState({
    temperature: "",
    ph_level: "",
    dissolved_oxygen: "",
    turbidity: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        temperature: "",
        ph_level: "",
        dissolved_oxygen: "",
        turbidity: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.temperature ||
      parseFloat(formData.temperature) < 0 ||
      parseFloat(formData.temperature) > 50
    ) {
      newErrors.temperature = "Suhu harus antara 0-50°C";
    }

    if (
      !formData.ph_level ||
      parseFloat(formData.ph_level) < 0 ||
      parseFloat(formData.ph_level) > 14
    ) {
      newErrors.ph_level = "pH harus antara 0-14";
    }

    if (
      !formData.dissolved_oxygen ||
      parseFloat(formData.dissolved_oxygen) < 0
    ) {
      newErrors.dissolved_oxygen = "Oksigen tidak boleh negatif";
    }

    if (!formData.turbidity || parseFloat(formData.turbidity) < 0) {
      newErrors.turbidity = "Kekeruhan tidak boleh negatif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      temperature: parseFloat(formData.temperature),
      ph_level: parseFloat(formData.ph_level),
      dissolved_oxygen: parseFloat(formData.dissolved_oxygen),
      turbidity: parseFloat(formData.turbidity),
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Data Monitoring Manual</DialogTitle>
          <DialogDescription>
            Input data monitoring kualitas air secara manual
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Suhu (°C) *</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={formData.temperature}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    temperature: e.target.value,
                  }))
                }
                className={errors.temperature ? "border-red-500" : ""}
                placeholder="28.0"
              />
              {errors.temperature && (
                <p className="text-sm text-red-500">{errors.temperature}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ph_level">pH *</Label>
              <Input
                id="ph_level"
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={formData.ph_level}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ph_level: e.target.value }))
                }
                className={errors.ph_level ? "border-red-500" : ""}
                placeholder="7.2"
              />
              {errors.ph_level && (
                <p className="text-sm text-red-500">{errors.ph_level}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dissolved_oxygen">Oksigen (mg/L) *</Label>
              <Input
                id="dissolved_oxygen"
                type="number"
                step="0.1"
                min="0"
                value={formData.dissolved_oxygen}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dissolved_oxygen: e.target.value,
                  }))
                }
                className={errors.dissolved_oxygen ? "border-red-500" : ""}
                placeholder="6.5"
              />
              {errors.dissolved_oxygen && (
                <p className="text-sm text-red-500">
                  {errors.dissolved_oxygen}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="turbidity">Kekeruhan (NTU) *</Label>
              <Input
                id="turbidity"
                type="number"
                step="0.1"
                min="0"
                value={formData.turbidity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    turbidity: e.target.value,
                  }))
                }
                className={errors.turbidity ? "border-red-500" : ""}
                placeholder="15.0"
              />
              {errors.turbidity && (
                <p className="text-sm text-red-500">{errors.turbidity}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export function WaterMonitoringPage({ onNavigate }) {
  // State untuk pond selection
  const [ponds, setPonds] = useState([]);
  const [selectedPondId, setSelectedPondId] = useState(null);

  // State untuk data monitoring
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);

  // State untuk UI
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("7");

  // State untuk form add log
  const [showAddLogForm, setShowAddLogForm] = useState(false);
  const [addingLog, setAddingLog] = useState(false);

  // Fetch ponds on mount
  useEffect(() => {
    fetchPonds();
  }, []);

  // Fetch logs when pond or time range changes
  useEffect(() => {
    if (selectedPondId) {
      fetchWaterQualityLogs();
    }
  }, [selectedPondId, timeRange]);

  const fetchPonds = async () => {
    try {
      setLoading(true);
      const result = await pondService.getAllPonds();

      if (result.success && result.data.length > 0) {
        setPonds(result.data);
        // Auto-select first pond or last selected
        const defaultPond = pondService.getDefaultPond(result.data);
        if (defaultPond) {
          setSelectedPondId(defaultPond.id);
        }
      } else {
        toast.info("Belum ada kolam", {
          description:
            "Tambahkan kolam terlebih dahulu di menu Manajemen Kolam",
        });
      }
    } catch (error) {
      toast.error("Gagal memuat data kolam");
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterQualityLogs = async () => {
    try {
      setRefreshing(true);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      const result = await monitoringService.getWaterQualityByDateRange(
        selectedPondId,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );

      if (result.success) {
        setLogs(result.data);

        // Format data for charts
        const formatted = monitoringService.formatChartData(result.data);
        setChartData(formatted);

        // Get latest for current status
        if (result.data.length > 0) {
          const latest = result.data[0];
          setCurrentStatus({
            suhu: {
              value: `${latest.temperature}°C`,
              status: monitoringService.getWaterQualityStatus(
                latest.temperature,
                "temperature"
              ),
              min: 25,
              max: 30,
            },
            ph: {
              value: latest.ph_level.toString(),
              status: monitoringService.getWaterQualityStatus(
                latest.ph_level,
                "ph_level"
              ),
              min: 6.5,
              max: 8.5,
            },
            kekeruhan: {
              value: `${latest.turbidity} NTU`,
              status: monitoringService.getWaterQualityStatus(
                latest.turbidity,
                "turbidity"
              ),
              max: 25,
            },
            oksigen: {
              value: `${latest.dissolved_oxygen} mg/L`,
              status: monitoringService.getWaterQualityStatus(
                latest.dissolved_oxygen,
                "dissolved_oxygen"
              ),
              min: 5.0,
            },
          });
        }
      } else {
        setLogs([]);
        setChartData([]);
        setCurrentStatus(null);
      }
    } catch (error) {
      toast.error("Gagal memuat data monitoring");
    } finally {
      setRefreshing(false);
    }
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  const handlePondChange = (pondId) => {
    setSelectedPondId(parseInt(pondId));
    pondService.saveSelectedPond(pondId);
  };

  const handleAddLog = async (logData) => {
    try {
      setAddingLog(true);
      const result = await monitoringService.addWaterQualityLog(
        selectedPondId,
        logData
      );

      if (result.success) {
        toast.success(result.message || "Data monitoring berhasil ditambahkan");
        setShowAddLogForm(false);
        fetchWaterQualityLogs();
      } else {
        toast.error(result.message || "Gagal menambahkan data monitoring");
      }
    } catch (error) {
      toast.error("Gagal menambahkan data monitoring");
    } finally {
      setAddingLog(false);
    }
  };

  const handleExport = () => {
    if (logs.length === 0) {
      toast.info("Tidak ada data untuk diexport");
      return;
    }

    // Prepare CSV data
    const headers = [
      "Tanggal",
      "Waktu",
      "Suhu (°C)",
      "pH",
      "Oksigen (mg/L)",
      "Kekeruhan (NTU)",
    ];
    const csvData = logs.map((log) => {
      const date = new Date(log.logged_at);
      return [
        date.toLocaleDateString("id-ID"),
        date.toLocaleTimeString("id-ID"),
        log.temperature,
        log.ph_level,
        log.dissolved_oxygen,
        log.turbidity,
      ];
    });

    // Create CSV string
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `monitoring_kolam_${selectedPondId}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Data berhasil diexport");
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

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar
          onNavigate={onNavigate}
          currentPage="water-monitoring"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (ponds.length === 0) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar
          onNavigate={onNavigate}
          currentPage="water-monitoring"
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Kolam</h3>
              <p className="text-muted-foreground mb-4">
                Anda perlu membuat kolam terlebih dahulu untuk monitoring
                kualitas air
              </p>
              <Button onClick={() => onNavigate("pond-management")}>
                <Plus className="w-4 h-4 mr-2" />
                Buat Kolam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        onNavigate={onNavigate}
        currentPage="water-monitoring"
      />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-foreground mb-2">Monitoring Kualitas Air</h1>
              <p className="text-muted-foreground">
                Data real-time dan historis kualitas air tambak
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={fetchWaterQualityLogs}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setShowAddLogForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Data Manual
              </Button>
            </div>
          </div>

          {/* Pond Selection */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <Label htmlFor="pond-select" className="mb-2 block">
                Pilih Kolam
              </Label>
              <Select
                value={selectedPondId?.toString()}
                onValueChange={handlePondChange}
                name="pond-select"
              >
                <SelectTrigger id="pond-select" className="w-full md:w-[300px]">
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
            </CardContent>
          </Card>

          {currentStatus ? (
            <>
              {/* Current Status Cards */}
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

              {/* Charts Section */}
              {chartData.length > 0 && (
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
              )}

              {/* History Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Data Monitoring</CardTitle>
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Data monitoring dari sensor IoT dan input manual
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
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.length > 0 ? (
                          logs.slice(0, 20).map((log, index) => {
                            const { date, time } = formatDateTime(
                              log.logged_at
                            );
                            return (
                              <TableRow key={index}>
                                <TableCell>{time}</TableCell>
                                <TableCell>{date}</TableCell>
                                <TableCell>{log.temperature}°C</TableCell>
                                <TableCell>{log.ph_level}</TableCell>
                                <TableCell>{log.turbidity} NTU</TableCell>
                                <TableCell>
                                  {log.dissolved_oxygen} mg/L
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="text-muted-foreground">
                                Belum ada data monitoring
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {logs.length > 0 && (
                    <div className="flex items-center justify-between mt-4">
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: "0.875rem" }}
                      >
                        Menampilkan {Math.min(20, logs.length)} dari{" "}
                        {logs.length} data
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Belum Ada Data Monitoring
                </h3>
                <p className="text-muted-foreground mb-4">
                  Belum ada data monitoring untuk kolam ini. Tambahkan data
                  manual atau tunggu data dari sensor IoT.
                </p>
                <Button onClick={() => setShowAddLogForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Data Manual
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Add Log Form Dialog */}
          <AddLogForm
            isOpen={showAddLogForm}
            onClose={() => setShowAddLogForm(false)}
            onSubmit={handleAddLog}
            pondId={selectedPondId}
            loading={addingLog}
          />
        </div>
      </div>
    </div>
  );
}
