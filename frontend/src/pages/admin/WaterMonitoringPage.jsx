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
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
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
  const [mlPrediction, setMlPrediction] = useState(null);

  // State untuk UI
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("7");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    // Reset to first page when pond or time range changes
    setCurrentPage(1);
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

        // Set ML prediction if available
        if (result.mlPrediction) {
          setMlPrediction(result.mlPrediction);
        } else {
          setMlPrediction(null);
        }

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
        setMlPrediction(null);
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

        // Refresh logs and ML prediction
        await fetchWaterQualityLogs();

        // If ML prediction is in response, update it
        if (result.data?.ml_prediction) {
          setMlPrediction(result.data.ml_prediction);
        }
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
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
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
        <div className="flex-1 lg:ml-64 flex items-center justify-center p-8">
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
      <div className="flex-1 lg:ml-64">
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

              {/* ML Prediction Section */}
              {mlPrediction && (
                <div className="mb-8 space-y-6">
                  {/* Prediction Results Card */}
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle>Hasil Prediksi Kualitas Air (ML)</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Analisis berdasarkan Machine Learning Model
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Kualitas
                          </p>
                          <div className="flex items-center gap-2">
                            {getMLQualityBadge(mlPrediction.quality)}
                            <p className="text-2xl font-bold">
                              {mlPrediction.quality || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">
                            Confidence
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {mlPrediction.confidence
                              ? `${(mlPrediction.confidence * 100).toFixed(2)}%`
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {mlPrediction.description && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <Droplet className="w-5 h-5" />
                            Deskripsi
                          </h3>
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {mlPrediction.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Issues */}
                      {mlPrediction.issues &&
                        mlPrediction.issues.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-amber-500" />
                              Masalah yang Terdeteksi
                            </h3>
                            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                              <ul className="space-y-2">
                                {mlPrediction.issues.map((issue, index) => (
                                  <li
                                    key={index}
                                    className="text-sm flex items-start gap-2"
                                  >
                                    <span className="text-amber-600 dark:text-amber-400 mt-1">
                                      •
                                    </span>
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                      {/* Recommendations */}
                      {mlPrediction.recommendations &&
                        mlPrediction.recommendations.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                              <Lightbulb className="w-5 h-5 text-yellow-500" />
                              Rekomendasi
                            </h3>
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <ol className="space-y-2">
                                {mlPrediction.recommendations.map(
                                  (recommendation, index) => (
                                    <li
                                      key={index}
                                      className="text-sm flex items-start gap-2"
                                    >
                                      <span className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
                                        {index + 1}.
                                      </span>
                                      <span>{recommendation}</span>
                                    </li>
                                  )
                                )}
                              </ol>
                            </div>
                          </div>
                        )}

                      {/* Class Probabilities */}
                      {mlPrediction.probabilities && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <CheckSquare className="w-5 h-5" />
                            Probabilitas Kualitas Air
                          </h3>
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <div className="space-y-2">
                              {Object.entries(mlPrediction.probabilities).map(
                                ([quality, prob]) => (
                                  <div
                                    key={quality}
                                    className="flex items-center justify-between"
                                  >
                                    <span className="text-sm font-medium">
                                      {quality}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-primary transition-all"
                                          style={{
                                            width: `${(prob * 100).toFixed(
                                              1
                                            )}%`,
                                          }}
                                        />
                                      </div>
                                      <span className="text-sm text-muted-foreground w-12 text-right">
                                        {(prob * 100).toFixed(2)}%
                                      </span>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

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
                        {(() => {
                          // Calculate pagination
                          const totalPages = Math.ceil(
                            logs.length / itemsPerPage
                          );
                          const startIndex = (currentPage - 1) * itemsPerPage;
                          const endIndex = startIndex + itemsPerPage;
                          const paginatedLogs = logs.slice(
                            startIndex,
                            endIndex
                          );

                          if (logs.length > 0) {
                            return paginatedLogs.map((log, index) => {
                              const { date, time } = formatDateTime(
                                log.logged_at
                              );
                              return (
                                <TableRow key={log.id || index}>
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
                            });
                          } else {
                            return (
                              <TableRow>
                                <TableCell
                                  colSpan={6}
                                  className="text-center py-8"
                                >
                                  <div className="text-muted-foreground">
                                    Belum ada data monitoring
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        })()}
                      </TableBody>
                    </Table>
                  </div>
                  {logs.length > 0 && (
                    <div className="flex items-center justify-between mt-4">
                      <p
                        className="text-muted-foreground"
                        style={{ fontSize: "0.875rem" }}
                      >
                        Menampilkan{" "}
                        {(() => {
                          const startIndex = (currentPage - 1) * itemsPerPage;
                          const endIndex = Math.min(
                            startIndex + itemsPerPage,
                            logs.length
                          );
                          const totalPages = Math.ceil(
                            logs.length / itemsPerPage
                          );
                          return `${startIndex + 1}-${endIndex} dari ${
                            logs.length
                          } data (Halaman ${currentPage} dari ${totalPages})`;
                        })()}
                      </p>
                      {(() => {
                        const totalPages = Math.ceil(
                          logs.length / itemsPerPage
                        );
                        if (totalPages <= 1) return null;

                        return (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                              {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                              ).map((page) => {
                                // Show first page, last page, current page, and pages around current
                                const showPage =
                                  page === 1 ||
                                  page === totalPages ||
                                  (page >= currentPage - 1 &&
                                    page <= currentPage + 1);

                                if (!showPage) {
                                  // Show ellipsis
                                  const prevPage = page - 1;
                                  const nextPage = page + 1;
                                  if (
                                    (prevPage === 1 ||
                                      prevPage === currentPage - 2) &&
                                    (nextPage === totalPages ||
                                      nextPage === currentPage + 2)
                                  ) {
                                    return (
                                      <span
                                        key={page}
                                        className="px-2 text-muted-foreground"
                                      >
                                        ...
                                      </span>
                                    );
                                  }
                                  return null;
                                }

                                return (
                                  <Button
                                    key={page}
                                    variant={
                                      currentPage === page
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="min-w-[32px]"
                                  >
                                    {page}
                                  </Button>
                                );
                              })}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(
                                    Math.ceil(logs.length / itemsPerPage),
                                    prev + 1
                                  )
                                )
                              }
                              disabled={
                                currentPage >=
                                Math.ceil(logs.length / itemsPerPage)
                              }
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })()}
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
