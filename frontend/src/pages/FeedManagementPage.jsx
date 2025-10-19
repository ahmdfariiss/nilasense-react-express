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
        
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feed-pond">Kolam *</Label>
              <Select
                name="pond_id"
                value={formData.pond_id.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, pond_id: value }))}
              >
                <SelectTrigger id="feed-pond">
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
              <Label htmlFor="feed-date">Tanggal</Label>
              <Input
                id="feed-date"
                name="feed_date"
                type="date"
                autoComplete="off"
                value={formData.feed_date}
                onChange={(e) => setFormData(prev => ({ ...prev, feed_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feed-time">Waktu Pemberian *</Label>
              <Input
                id="feed-time"
                name="feed_time"
                type="time"
                autoComplete="off"
                value={formData.feed_time}
                onChange={(e) => setFormData(prev => ({ ...prev, feed_time: e.target.value }))}
                className={errors.feed_time ? 'border-red-500' : ''}
              />
              {errors.feed_time && (
                <p className="text-sm text-red-500">{errors.feed_time}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feed-amount">Jumlah (kg) *</Label>
              <Input
                id="feed-amount"
                name="amount_kg"
                type="number"
                step="0.1"
                min="0"
                max="100"
                autoComplete="off"
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
            <Label htmlFor="feed-type">Jenis Pakan</Label>
            <Select
              name="feed_type"
              value={formData.feed_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, feed_type: value }))}
            >
              <SelectTrigger id="feed-type">
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

export function FeedManagementPage({ onNavigate }) {
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
      } else {
        const result = await feedService.getAdminFeedSchedulesByDate(selectedPond, selectedDate);
        if (result.success) {
          setSchedules(result.data);
        } else {
          setSchedules([]);
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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
            <span>Memuat data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Manajemen Jadwal Pakan</h1>
          <p className="text-muted-foreground">
            Kelola jadwal pemberian pakan untuk semua kolam
          </p>
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
              onClick={fetchSchedules}
              disabled={refreshing}
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
    </div>
  );
}