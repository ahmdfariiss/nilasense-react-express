import { useState, useEffect } from 'react';
import {
  Droplet,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  MapPin,
  Calendar,
  Activity,
  AlertCircle,
  Loader2,
  Eye,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import AdminLayout from '@/components/layouts/AdminLayout';
import pondService from '@/services/pondService';

// Loading skeleton component
function PondTableLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState({ searchTerm, onAddPond, onClearSearch }) {
  return (
    <div className="text-center py-12">
      <Droplet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {searchTerm ? 'Tidak ada kolam yang cocok' : 'Belum ada kolam'}
      </h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm 
          ? `Tidak ditemukan kolam dengan kata kunci "${searchTerm}"`
          : 'Mulai dengan menambahkan kolam budidaya pertama Anda'
        }
      </p>
      <div className="flex gap-2 justify-center">
        {searchTerm && (
          <Button variant="outline" onClick={onClearSearch}>
            Hapus Filter
          </Button>
        )}
        <Button onClick={onAddPond}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kolam
        </Button>
      </div>
    </div>
  );
}

// Pond Form Component
function PondForm({ isOpen, onClose, onSubmit, editData, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        location: editData.location || ''
      });
    } else {
      setFormData({
        name: '',
        location: ''
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = pondService.validatePondData(formData);
    if (!validation.isValid) {
      const newErrors = {};
      validation.errors.forEach(error => {
        if (error.includes('Nama')) newErrors.name = error;
        if (error.includes('Lokasi')) newErrors.location = error;
      });
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Kolam' : 'Tambah Kolam Baru'}
          </DialogTitle>
          <DialogDescription>
            {editData 
              ? 'Perbarui informasi kolam budidaya'
              : 'Tambahkan kolam budidaya baru ke sistem'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kolam *</Label>
            <Input
              id="name"
              placeholder="Contoh: Kolam A1, Kolam Utama"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi (Opsional)</Label>
            <Input
              id="location"
              placeholder="Contoh: Sektor A, Blok 1"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
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
}

// Pond Detail Modal
function PondDetailModal({ isOpen, onClose, pond, statistics }) {
  if (!pond) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-600" />
            {pond.name}
          </DialogTitle>
          <DialogDescription>
            Detail informasi kolam budidaya
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Nama Kolam</Label>
              <p className="text-foreground">{pond.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Lokasi</Label>
              <p className="text-foreground">{pond.location || 'Tidak ada lokasi'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</Label>
              <p className="text-foreground">
                {new Date(pond.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">ID Kolam</Label>
              <p className="text-foreground font-mono">#{pond.id}</p>
            </div>
          </div>

          {statistics && (
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-muted-foreground mb-3 block">Statistik Kolam</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {statistics.todayFeedSchedules || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Jadwal Pakan Hari Ini</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {statistics.completedToday || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Selesai Hari Ini</p>
                </div>
              </div>
              
              {statistics.latestWaterQuality && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Kualitas Air Terakhir</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Suhu: {statistics.latestWaterQuality.temperature}°C</div>
                    <div>pH: {statistics.latestWaterQuality.ph}</div>
                    <div>Oksigen: {statistics.latestWaterQuality.dissolved_oxygen} mg/L</div>
                    <div>Kekeruhan: {statistics.latestWaterQuality.turbidity} NTU</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminPondManagementPage() {
  // State management
  const [ponds, setPonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingPond, setEditingPond] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Detail modal states
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [pondStatistics, setPondStatistics] = useState(null);
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load ponds data
  const fetchPonds = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);

      const result = await pondService.getAllPonds();
      
      if (result.success) {
        setPonds(result.data);
        if (showToast) {
          toast.success("Data kolam berhasil diperbarui");
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Gagal memuat data kolam");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPonds();
  }, []);

  const handleRefresh = () => {
    fetchPonds(true);
  };

  const handleAddPond = () => {
    setEditingPond(null);
    setShowForm(true);
  };

  const handleEditPond = (pond) => {
    setEditingPond(pond);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      let result;
      if (editingPond) {
        result = await pondService.updatePond(editingPond.id, formData);
      } else {
        result = await pondService.createPond(formData);
      }
      
      if (result.success) {
        toast.success(result.message);
        setShowForm(false);
        setEditingPond(null);
        fetchPonds();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(editingPond ? "Gagal memperbarui kolam" : "Gagal menambah kolam");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePond = async (pondId) => {
    try {
      setDeleting(true);
      const result = await pondService.deletePond(pondId);
      
      if (result.success) {
        toast.success(result.message);
        setDeleteConfirm(null);
        fetchPonds();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Gagal menghapus kolam");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDetail = async (pond) => {
    setSelectedPond(pond);
    setShowDetail(true);
    
    // Load pond statistics
    try {
      const statsResult = await pondService.getPondStatistics(pond.id);
      if (statsResult.success) {
        setPondStatistics(statsResult.data);
      }
    } catch (error) {
      console.error('Error loading pond statistics:', error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Filter and sort ponds
  const filteredPonds = pondService.searchPonds(ponds, searchTerm);
  const sortedPonds = pondService.sortPonds(filteredPonds, sortBy, sortOrder);

  if (loading) {
    return (
      <AdminLayout title="Manajemen Kolam" subtitle="Kelola kolam budidaya Anda">
        <PondTableLoading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manajemen Kolam" subtitle="Kelola kolam budidaya Anda">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari kolam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Terbaru</SelectItem>
                <SelectItem value="created_at-asc">Terlama</SelectItem>
                <SelectItem value="name-asc">Nama A-Z</SelectItem>
                <SelectItem value="name-desc">Nama Z-A</SelectItem>
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
            <Button onClick={handleAddPond}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kolam
            </Button>
          </div>
        </div>

        {/* Ponds Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-600" />
              Daftar Kolam ({sortedPonds.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedPonds.length === 0 ? (
              <EmptyState 
                searchTerm={searchTerm}
                onAddPond={handleAddPond}
                onClearSearch={handleClearSearch}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kolam</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPonds.map((pond) => (
                    <TableRow key={pond.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Droplet className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{pond.name}</p>
                            <p className="text-sm text-muted-foreground">ID: #{pond.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {pond.location || 'Tidak ada lokasi'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {new Date(pond.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          <Activity className="w-3 h-3 mr-1" />
                          Aktif
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(pond)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPond(pond)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(pond)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <PondForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingPond(null);
          }}
          onSubmit={handleFormSubmit}
          editData={editingPond}
          loading={formLoading}
        />

        {/* Detail Modal */}
        <PondDetailModal
          isOpen={showDetail}
          onClose={() => {
            setShowDetail(false);
            setSelectedPond(null);
            setPondStatistics(null);
          }}
          pond={selectedPond}
          statistics={pondStatistics}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Konfirmasi Hapus Kolam
              </AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus kolam <strong>"{deleteConfirm?.name}"</strong>?
                <br />
                <span className="text-red-600 font-medium">
                  Tindakan ini akan menghapus semua data monitoring dan jadwal pakan yang terkait dengan kolam ini.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeletePond(deleteConfirm.id)}
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

export default AdminPondManagementPage;