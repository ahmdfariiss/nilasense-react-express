import { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Plus,
  Edit,
  Trash2,
  Clock,
  Package,
  RefreshCw,
  Calendar,
  Search,
  Filter,
  AlertCircle,
  Loader2,
  CheckCircle,
  Play,
  X,
  Download,
  Upload,
  Check,
  Square,
  CheckSquare,
  BarChart3,
  TrendingUp
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import feedService from "../services/feedService";
import pondService from "../services/pondService";
import { toast } from "sonner";

// Form component for creating/editing feed schedules
const FeedScheduleForm = ({ isOpen, onClose, onSubmit, editData, ponds, loading }) => {
  const [formData, setFormData] = useState({
    pond_id: '',
    feed_time: '',
    amount_kg: '',
    feed_type: 'Pelet Standar',
    feed_date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        pond_id: editData.pond_id || '',
        feed_time: editData.feed_time || '',
        amount_kg: editData.amount_kg || '',
        feed_type: editData.feed_type || 'Pelet Standar',
        feed_date: editData.feed_date || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        pond_id: '',
        feed_time: '',
        amount_kg: '',
        feed_type: 'Pelet Standar',
        feed_date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = feedService.validateScheduleData(formData);
    if (!validation.isValid) {
      const newErrors = {};
      validation.errors.forEach(error => {
        if (error.includes('Kolam')) newErrors.pond_id = error;
        if (error.includes('Waktu')) newErrors.feed_time = error;
        if (error.includes('Jumlah')) newErrors.amount_kg = error;
      });
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const feedTypes = [
    'Pelet Standar',
    'Pelet Protein Tinggi',
    'Pelet Protein Sedang',
    'Pelet Starter',
    'Pakan Alami',
    'Pelet Organik'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Jadwal Pakan' : 'Tambah Jadwal Pakan'}
          </DialogTitle>
          <DialogDescription>
            {editData ? 'Perbarui informasi jadwal pakan' : 'Buat jadwal pemberian pakan baru untuk kolam'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pond_id">Kolam *</Label>
              <Select
                value={formData.pond_id.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, pond_id: value }))}
              >
                <SelectTrigger>
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
              {errors.pond_id && (
                <p className="text-sm text-red-500">{errors.pond_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feed_date">Tanggal</Label>
              <Input
                id="feed_date"
                type="date"
                value={formData.feed_date}
                onChange={(e) => setFormData(prev => ({ ...prev, feed_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feed_time">Waktu Pemberian *</Label>
              <Input
                id="feed_time"
                type="time"
                value={formData.feed_time}
                onChange={(e) => setFormData(prev => ({ ...prev, feed_time: e.target.value }))}
                className={errors.feed_time ? 'border-red-500' : ''}
              />
              {errors.feed_time && (
                <p className="text-sm text-red-500">{errors.feed_time}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount_kg">Jumlah (kg) *</Label>
              <Input
                id="amount_kg"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.amount_kg}
                onChange={(e) => setFormData(prev => ({ ...prev, amount_kg: e.target.value }))}
                className={errors.amount_kg ? 'border-red-500' : ''}
              />
              {errors.amount_kg && (
                <p className="text-sm text-red-500">{errors.amount_kg}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feed_type">Jenis Pakan</Label>
            <Select
              value={formData.feed_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, feed_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {feedTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editData ? 'Perbarui' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export function AdminFeedManagementPage() {
  // State management
  const [schedules, setSchedules] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPond, setSelectedPond] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  
  // Bulk operations
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  
  // Analytics
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalSchedules: 0,
    completedSchedules: 0,
    pendingSchedules: 0,
    totalFeedAmount: 0,
    completionRate: 0
  });
  const [formLoading, setFormLoading] = useState(false);
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Status update
  const [updatingSchedule, setUpdatingSchedule] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (ponds.length > 0) {
      fetchSchedules();
    }
  }, [selectedPond, selectedDate, ponds]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const pondsResult = await pondService.getAllPonds(); // Admin gets their own ponds
      
      if (pondsResult.success) {
        setPonds(pondsResult.data);
      } else {
        toast.error(pondsResult.message);
      }
    } catch (error) {
      toast.error("Gagal memuat data awal");
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      setRefreshing(true);
      
      if (selectedPond === 'all') {
        // Fetch schedules for all ponds
        const allSchedules = [];
        for (const pond of ponds) {
          const result = await feedService.getAdminFeedSchedulesByDate(pond.id, selectedDate);
          if (result.success) {
            allSchedules.push(...result.data);
          }
        }
        setSchedules(allSchedules);
        
        // Calculate analytics for all schedules
        const totalSchedules = allSchedules.length;
        const completedSchedules = allSchedules.filter(s => s.is_done).length;
        const pendingSchedules = totalSchedules - completedSchedules;
        const totalFeedAmount = allSchedules.reduce((sum, s) => sum + parseFloat(s.amount_kg || 0), 0);
        const completionRate = totalSchedules > 0 ? (completedSchedules / totalSchedules) * 100 : 0;
        
        setAnalytics({
          totalSchedules,
          completedSchedules,
          pendingSchedules,
          totalFeedAmount,
          completionRate
        });
      } else {
        const result = await feedService.getAdminFeedSchedulesByDate(selectedPond, selectedDate);
        if (result.success) {
          setSchedules(result.data);
          
          // Calculate analytics for specific pond/date
          const totalSchedules = result.data.length;
          const completedSchedules = result.data.filter(s => s.is_done).length;
          const pendingSchedules = totalSchedules - completedSchedules;
          const totalFeedAmount = result.data.reduce((sum, s) => sum + parseFloat(s.amount_kg || 0), 0);
          const completionRate = totalSchedules > 0 ? (completedSchedules / totalSchedules) * 100 : 0;
          
          setAnalytics({
            totalSchedules,
            completedSchedules,
            pendingSchedules,
            totalFeedAmount,
            completionRate
          });
        } else {
          setSchedules([]);
          setAnalytics({
            totalSchedules: 0,
            completedSchedules: 0,
            pendingSchedules: 0,
            totalFeedAmount: 0,
            completionRate: 0
          });
          if (result.message !== 'Belum ada jadwal pakan') {
            toast.error(result.message);
          }
        }
      }
    } catch (error) {
      toast.error("Gagal memuat jadwal pakan");
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateSchedule = async (formData) => {
    try {
      setFormLoading(true);
      const result = await feedService.createFeedSchedule(formData);
      
      if (result.success) {
        toast.success(result.message);
        setShowForm(false);
        fetchSchedules();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Gagal menambahkan jadwal");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSchedule = async (formData) => {
    try {
      setFormLoading(true);
      const result = await feedService.updateFeedSchedule(editingSchedule.id, formData);
      
      if (result.success) {
        toast.success(result.message);
        setShowForm(false);
        setEditingSchedule(null);
        fetchSchedules();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Gagal memperbarui jadwal");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      setDeleting(true);
      const result = await feedService.deleteFeedSchedule(scheduleId);
      
      if (result.success) {
        toast.success(result.message);
        setDeleteConfirm(null);
        fetchSchedules();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Gagal menghapus jadwal");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusUpdate = async (scheduleId, newStatus) => {
    try {
      setUpdatingSchedule(scheduleId);
      
      const result = newStatus === 'completed' 
        ? await feedService.markFeedAsCompleted(scheduleId)
        : await feedService.markFeedAsPending(scheduleId);

      if (result.success) {
        toast.success(result.message);
        fetchSchedules();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Gagal mengubah status jadwal");
    } finally {
      setUpdatingSchedule(null);
    }
  };

  // Bulk operations handlers
  const handleSelectAll = () => {
    if (selectedSchedules.length === filteredSchedules.length) {
      setSelectedSchedules([]);
    } else {
      setSelectedSchedules(filteredSchedules.map(s => s.id));
    }
  };

  const handleSelectSchedule = (scheduleId) => {
    setSelectedSchedules(prev => 
      prev.includes(scheduleId) 
        ? prev.filter(id => id !== scheduleId)
        : [...prev, scheduleId]
    );
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedSchedules.length === 0) return;

    try {
      setBulkLoading(true);
      
      if (bulkAction === 'complete') {
        const promises = selectedSchedules.map(id => 
          feedService.markFeedAsCompleted(id)
        );
        await Promise.all(promises);
        toast.success(`${selectedSchedules.length} jadwal berhasil ditandai selesai`);
      } else if (bulkAction === 'pending') {
        const promises = selectedSchedules.map(id => 
          feedService.markFeedAsPending(id)
        );
        await Promise.all(promises);
        toast.success(`${selectedSchedules.length} jadwal berhasil direset`);
      } else if (bulkAction === 'delete') {
        const promises = selectedSchedules.map(id => 
          feedService.deleteFeedSchedule(id)
        );
        await Promise.all(promises);
        toast.success(`${selectedSchedules.length} jadwal berhasil dihapus`);
      }
      
      setSelectedSchedules([]);
      setBulkAction('');
      fetchSchedules();
    } catch (error) {
      toast.error("Gagal melakukan operasi bulk");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      // Prepare CSV data
      const csvHeaders = ['Tanggal', 'Kolam', 'Waktu', 'Jenis Pakan', 'Jumlah (kg)', 'Status'];
      const csvData = filteredSchedules.map(schedule => [
        schedule.feed_date,
        schedule.pond_name,
        schedule.feed_time,
        schedule.feed_type,
        schedule.amount_kg,
        schedule.is_done ? 'Selesai' : 'Pending'
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
      link.setAttribute('download', `feed_schedules_${selectedDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data berhasil diekspor");
    } catch (error) {
      toast.error("Gagal mengekspor data");
    }
  };

  // Filter schedules based on search term
  const filteredSchedules = schedules.filter(schedule => {
    const searchLower = searchTerm.toLowerCase();
    return (
      schedule.feed_type?.toLowerCase().includes(searchLower) ||
      schedule.pond_name?.toLowerCase().includes(searchLower) ||
      schedule.feed_time?.includes(searchLower)
    );
  });

  const getStatusBadge = (status) => {
    const statusClass = feedService.getStatusBadgeClass(status);
    const statusLabel = feedService.getStatusLabel(status);
    return <Badge className={statusClass}>{statusLabel}</Badge>;
  };

  if (loading) {
    return (
      <AdminLayout title="Manajemen Jadwal Pakan" subtitle="Kelola jadwal pemberian pakan untuk semua kolam">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
          <span>Memuat data...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manajemen Jadwal Pakan" subtitle="Kelola jadwal pemberian pakan untuk semua kolam">
      <div className="space-y-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Jadwal</p>
                  <p className="text-xl font-bold">{analytics.totalSchedules}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Selesai</p>
                  <p className="text-xl font-bold">{analytics.completedSchedules}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold">{analytics.pendingSchedules}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Pakan</p>
                  <p className="text-xl font-bold">{analytics.totalFeedAmount.toFixed(1)} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-xl font-bold">{analytics.completionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-1 gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari berdasarkan jenis pakan, kolam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <Select value={selectedPond} onValueChange={setSelectedPond}>
              <SelectTrigger className="w-[180px]">
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

            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-[150px]"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportData}
              disabled={filteredSchedules.length === 0}
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            
            <Button
              variant="outline"
              onClick={fetchSchedules}
              disabled={refreshing}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Jadwal
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedSchedules.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedSchedules.length} jadwal dipilih
                </span>
                
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Pilih aksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Tandai Selesai</SelectItem>
                    <SelectItem value="pending">Reset ke Pending</SelectItem>
                    <SelectItem value="delete">Hapus Jadwal</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={handleBulkAction}
                  disabled={!bulkAction || bulkLoading}
                  variant={bulkAction === 'delete' ? 'destructive' : 'default'}
                  size="sm"
                >
                  {bulkLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Jalankan
                </Button>
                
                <Button
                  onClick={() => setSelectedSchedules([])}
                  variant="outline"
                  size="sm"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedules Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Jadwal Pakan - {new Date(selectedDate).toLocaleDateString('id-ID')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAll}
                      className="p-0 h-auto"
                    >
                      {selectedSchedules.length === filteredSchedules.length && filteredSchedules.length > 0 ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>Kolam</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Sesi</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Jenis Pakan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectSchedule(schedule.id)}
                          className="p-0 h-auto"
                        >
                          {selectedSchedules.includes(schedule.id) ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {schedule.pond_name || 'Unknown'}
                      </TableCell>
                      <TableCell>{schedule.feed_time?.substring(0, 5)}</TableCell>
                      <TableCell>
                        {feedService.getFeedSessionType(schedule.feed_time)}
                      </TableCell>
                      <TableCell>{schedule.amount_kg} kg</TableCell>
                      <TableCell>{schedule.feed_type}</TableCell>
                      <TableCell>
                        {getStatusBadge(schedule.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {schedule.status === 'pending' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(schedule.id, 'completed')}
                              disabled={updatingSchedule === schedule.id}
                              className="text-green-600 hover:text-green-700"
                            >
                              {updatingSchedule === schedule.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(schedule.id, 'pending')}
                              disabled={updatingSchedule === schedule.id}
                              className="text-orange-600 hover:text-orange-700"
                            >
                              {updatingSchedule === schedule.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Play className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingSchedule(schedule);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(schedule)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm ? 'Tidak ada jadwal yang cocok dengan pencarian' : 'Belum ada jadwal pakan'}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <FeedScheduleForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingSchedule(null);
          }}
          onSubmit={editingSchedule ? handleEditSchedule : handleCreateSchedule}
          editData={editingSchedule}
          ponds={ponds}
          loading={formLoading}
        />

        {/* Delete Confirmation */}
        <AlertDialog 
          open={!!deleteConfirm} 
          onOpenChange={() => setDeleteConfirm(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Jadwal Pakan</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus jadwal pakan pada {deleteConfirm?.feed_time} 
                untuk kolam {deleteConfirm?.pond_name}? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteSchedule(deleteConfirm.id)}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}