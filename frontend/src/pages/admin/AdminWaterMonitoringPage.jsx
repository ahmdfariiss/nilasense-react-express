import { useState, useEffect } from "react";
import {
  Droplet,
  Calendar,
  Download,
  RefreshCw,
  Plus,
  TrendingUp,
  Activity,
  AlertCircle,
  Loader2,
  FileText,
  BarChart3,
  Filter,
  Search
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { toast } from "sonner";
import AdminLayout from "@/components/layouts/AdminLayout";
import monitoringService from "@/services/monitoringService";
import pondService from "@/services/pondService";

// Loading skeleton component
function MonitoringLoading() {
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

      {/* Chart Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Manual Log Entry Form
function ManualLogForm({ isOpen, onClose, onSubmit, ponds, loading }) {
  const [formData, setFormData] = useState({
    pond_id: '',
    temperature: '',
    ph: '',
    dissolved_oxygen: '',
    turbidity: '',
    recorded_at: new Date().toISOString().slice(0, 16)
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        pond_id: '',
        temperature: '',
        ph: '',
        dissolved_oxygen: '',
        turbidity: '',
        recorded_at: new Date().toISOString().slice(0, 16)
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.pond_id) newErrors.pond_id = 'Kolam harus dipilih';
    if (!formData.temperature) newErrors.temperature = 'Suhu harus diisi';
    if (!formData.ph) newErrors.ph = 'pH harus diisi';
    if (!formData.dissolved_oxygen) newErrors.dissolved_oxygen = 'Oksigen terlarut harus diisi';
    if (!formData.turbidity) newErrors.turbidity = 'Kekeruhan harus diisi';
    
    // Validate ranges
    if (formData.temperature && (formData.temperature < 0 || formData.temperature > 50)) {
      newErrors.temperature = 'Suhu harus antara 0-50°C';
    }
    if (formData.ph && (formData.ph < 0 || formData.ph > 14)) {
      newErrors.ph = 'pH harus antara 0-14';
    }
    if (formData.dissolved_oxygen && (formData.dissolved_oxygen < 0 || formData.dissolved_oxygen > 20)) {
      newErrors.dissolved_oxygen = 'Oksigen terlarut harus antara 0-20 mg/L';
    }
    if (formData.turbidity && (formData.turbidity < 0 || formData.turbidity > 1000)) {
      newErrors.turbidity = 'Kekeruhan harus antara 0-1000 NTU';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Data Monitoring Manual</DialogTitle>
          <DialogDescription>
            Masukkan data kualitas air secara manual untuk kolam yang dipilih
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pond_id">Kolam *</Label>
            <Select value={formData.pond_id} onValueChange={(value) => setFormData(prev => ({ ...prev, pond_id: value }))}>
              <SelectTrigger className={errors.pond_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Pilih kolam" />
              </SelectTrigger>
              <SelectContent>
                {ponds.map((pond) => (
                  <SelectItem key={pond.id} value={pond.id.toString()}>
                    {pond.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pond_id && <p className="text-sm text-red-500">{errors.pond_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Suhu (°C) *</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="25.5"
                value={formData.temperature}
                onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                className={errors.temperature ? 'border-red-500' : ''}
              />
              {errors.temperature && <p className="text-sm text-red-500">{errors.temperature}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ph">pH *</Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                placeholder="7.2"
                value={formData.ph}
                onChange={(e) => setFormData(prev => ({ ...prev, ph: e.target.value }))}
                className={errors.ph ? 'border-red-500' : ''}
              />
              {errors.ph && <p className="text-sm text-red-500">{errors.ph}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dissolved_oxygen">Oksigen (mg/L) *</Label>
              <Input
                id="dissolved_oxygen"
                type="number"
                step="0.1"
                placeholder="6.5"
                value={formData.dissolved_oxygen}
                onChange={(e) => setFormData(prev => ({ ...prev, dissolved_oxygen: e.target.value }))}
                className={errors.dissolved_oxygen ? 'border-red-500' : ''}
              />
              {errors.dissolved_oxygen && <p className="text-sm text-red-500">{errors.dissolved_oxygen}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="turbidity">Kekeruhan (NTU) *</Label>
              <Input
                id="turbidity"
                type="number"
                step="0.1"
                placeholder="15.2"
                value={formData.turbidity}
                onChange={(e) => setFormData(prev => ({ ...prev, turbidity: e.target.value }))}
                className={errors.turbidity ? 'border-red-500' : ''}
              />
              {errors.turbidity && <p className="text-sm text-red-500">{errors.turbidity}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recorded_at">Waktu Pencatatan *</Label>
            <Input
              id="recorded_at"
              type="datetime-local"
              value={formData.recorded_at}
              onChange={(e) => setFormData(prev => ({ ...prev, recorded_at: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan Data
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminWaterMonitoringPage() {
  // State management
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState('all');
  const [timeRange, setTimeRange] = useState('7');
  const [monitoringData, setMonitoringData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Manual log form
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualFormLoading, setManualFormLoading] = useState(false);
  
  // Statistics
  const [statistics, setStatistics] = useState({
    totalLogs: 0,
    averageTemperature: 0,
    averagePh: 0,
    averageOxygen: 0,
    averageTurbidity: 0
  });

  // Load ponds
  const fetchPonds = async () => {
    try {
      const result = await pondService.getAllPonds();
      if (result.success) {
        setPonds(result.data);
        if (result.data.length > 0 && selectedPond === 'all') {
          // Don't auto-select, keep 'all' for combined view
        }
      }
    } catch (error) {
      console.error('Error fetching ponds:', error);
    }
  };

  // Load monitoring data
  const fetchMonitoringData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);

      let allData = [];
      let chartFormattedData = [];

      if (selectedPond === 'all') {
        // Fetch data from all ponds
        const dataPromises = ponds.map(async (pond) => {
          try {
            const result = await monitoringService.getWaterQualityLogs(pond.id, parseInt(timeRange));
            if (result.success) {
              return result.data.map(log => ({
                ...log,
                pond_name: pond.name
              }));
            }
            return [];
          } catch (error) {
            console.error(`Error fetching data for pond ${pond.id}:`, error);
            return [];
          }
        });

        const pondsData = await Promise.all(dataPromises);
        allData = pondsData.flat().sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));
        
        // For chart, we'll show average values by time
        chartFormattedData = monitoringService.formatChartData(allData);
      } else {
        // Fetch data for specific pond
        const result = await monitoringService.getWaterQualityLogs(selectedPond, parseInt(timeRange));
        if (result.success) {
          allData = result.data;
          chartFormattedData = monitoringService.formatChartData(allData);
        }
      }

      setMonitoringData(allData);
      setChartData(chartFormattedData);

      // Calculate statistics
      if (allData.length > 0) {
        const stats = {
          totalLogs: allData.length,
          averageTemperature: allData.reduce((sum, log) => sum + log.temperature, 0) / allData.length,
          averagePh: allData.reduce((sum, log) => sum + log.ph, 0) / allData.length,
          averageOxygen: allData.reduce((sum, log) => sum + log.dissolved_oxygen, 0) / allData.length,
          averageTurbidity: allData.reduce((sum, log) => sum + log.turbidity, 0) / allData.length
        };
        setStatistics(stats);
      } else {
        setStatistics({
          totalLogs: 0,
          averageTemperature: 0,
          averagePh: 0,
          averageOxygen: 0,
          averageTurbidity: 0
        });
      }

      if (showToast) {
        toast.success("Data monitoring berhasil diperbarui");
      }
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      toast.error("Gagal memuat data monitoring");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPonds();
  }, []);

  useEffect(() => {
    if (ponds.length > 0) {
      fetchMonitoringData();
    }
  }, [selectedPond, timeRange, ponds]);

  const handleRefresh = () => {
    fetchMonitoringData(true);
  };

  const handleManualLogSubmit = async (formData) => {
    try {
      setManualFormLoading(true);
      
      // Here you would call the API to save manual log
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Data monitoring berhasil ditambahkan");
      setShowManualForm(false);
      fetchMonitoringData(true);
    } catch (error) {
      toast.error("Gagal menambahkan data monitoring");
    } finally {
      setManualFormLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      
      // Prepare CSV data
      const csvHeaders = ['Tanggal', 'Waktu', 'Kolam', 'Suhu (°C)', 'pH', 'Oksigen (mg/L)', 'Kekeruhan (NTU)', 'Status'];
      const csvData = monitoringData.map(log => [
        new Date(log.recorded_at).toLocaleDateString('id-ID'),
        new Date(log.recorded_at).toLocaleTimeString('id-ID'),
        log.pond_name || 'Unknown',
        log.temperature,
        log.ph,
        log.dissolved_oxygen,
        log.turbidity,
        monitoringService.determineWaterQualityStatus(log)
      ]);

      // Create CSV content
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.join(','))
        .join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `water_monitoring_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data berhasil diekspor");
    } catch (error) {
      toast.error("Gagal mengekspor data");
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (log) => {
    const status = monitoringService.determineWaterQualityStatus(log);
    const statusConfig = {
      'good': { label: 'Baik', className: 'bg-green-100 text-green-800 border-green-200' },
      'warning': { label: 'Perhatian', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'danger': { label: 'Bahaya', className: 'bg-red-100 text-red-800 border-red-200' }
    };
    
    const config = statusConfig[status] || statusConfig['warning'];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <AdminLayout title="Water Monitoring (Admin)" subtitle="Pantau dan kelola data kualitas air secara real-time">
        <MonitoringLoading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Water Monitoring (Admin)" subtitle="Pantau dan kelola data kualitas air secara real-time">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            <Select value={selectedPond} onValueChange={setSelectedPond}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kolam</SelectItem>
                {ponds.map((pond) => (
                  <SelectItem key={pond.id} value={pond.id.toString()}>
                    {pond.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Hari</SelectItem>
                <SelectItem value="7">7 Hari</SelectItem>
                <SelectItem value="30">30 Hari</SelectItem>
                <SelectItem value="90">90 Hari</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Memperbarui...' : 'Perbarui'}
            </Button>
            <Button
              onClick={() => setShowManualForm(true)}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Data
            </Button>
            <Button
              onClick={handleExportData}
              disabled={exporting || monitoringData.length === 0}
              variant="outline"
              size="sm"
            >
              <Download className={`w-4 h-4 mr-2 ${exporting ? 'animate-spin' : ''}`} />
              {exporting ? 'Mengekspor...' : 'Ekspor CSV'}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Log</p>
                  <p className="text-xl font-bold">{statistics.totalLogs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Rata-rata Suhu</p>
                  <p className="text-xl font-bold">{statistics.averageTemperature.toFixed(1)}°C</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Rata-rata pH</p>
                  <p className="text-xl font-bold">{statistics.averagePh.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Rata-rata O₂</p>
                  <p className="text-xl font-bold">{statistics.averageOxygen.toFixed(1)} mg/L</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Rata-rata Kekeruhan</p>
                  <p className="text-xl font-bold">{statistics.averageTurbidity.toFixed(1)} NTU</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Tren Kualitas Air ({timeRange} Hari Terakhir)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
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
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef444420"
                      name="Suhu (°C)"
                    />
                    <Area
                      type="monotone"
                      dataKey="ph"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b98120"
                      name="pH"
                    />
                    <Area
                      type="monotone"
                      dataKey="dissolved_oxygen"
                      stackId="3"
                      stroke="#3b82f6"
                      fill="#3b82f620"
                      name="Oksigen (mg/L)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Belum ada data monitoring</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Data Monitoring Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monitoringData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal & Waktu</TableHead>
                    {selectedPond === 'all' && <TableHead>Kolam</TableHead>}
                    <TableHead>Suhu (°C)</TableHead>
                    <TableHead>pH</TableHead>
                    <TableHead>Oksigen (mg/L)</TableHead>
                    <TableHead>Kekeruhan (NTU)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monitoringData.slice(0, 20).map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {new Date(log.recorded_at).toLocaleDateString('id-ID')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(log.recorded_at).toLocaleTimeString('id-ID')}
                          </p>
                        </div>
                      </TableCell>
                      {selectedPond === 'all' && (
                        <TableCell>
                          <Badge variant="outline">{log.pond_name}</Badge>
                        </TableCell>
                      )}
                      <TableCell>{log.temperature}</TableCell>
                      <TableCell>{log.ph}</TableCell>
                      <TableCell>{log.dissolved_oxygen}</TableCell>
                      <TableCell>{log.turbidity}</TableCell>
                      <TableCell>{getStatusBadge(log)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Belum ada data monitoring</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Log Form */}
        <ManualLogForm
          isOpen={showManualForm}
          onClose={() => setShowManualForm(false)}
          onSubmit={handleManualLogSubmit}
          ponds={ponds}
          loading={manualFormLoading}
        />
      </div>
    </AdminLayout>
  );
}

export default AdminWaterMonitoringPage;