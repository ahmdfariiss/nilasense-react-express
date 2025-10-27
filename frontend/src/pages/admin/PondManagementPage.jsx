import { useState, useEffect } from "react";
import {
  Waves,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Loader2,
  MapPin,
  Calendar,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import pondService from "@/services/pondService";
import { toast } from "sonner";
import { DashboardSidebar } from "@/layouts/DashboardSidebar";

// Form component for creating/editing ponds
const PondForm = ({ isOpen, onClose, onSubmit, editData, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes, based on editData
  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setFormData({
        name: "",
        location: "",
        description: "",
      });
      setErrors({});
      return;
    }

    // When modal opens, populate form based on editData
    if (isOpen && editData) {
      setFormData({
        name: editData.name || "",
        location: editData.location || "",
        description: editData.description || "",
      });
      setErrors({});
    } else if (isOpen && !editData) {
      // Modal opened for creating new pond
      setFormData({
        name: "",
        location: "",
        description: "",
      });
      setErrors({});
    }
  }, [isOpen, editData?.id]); // Only depend on editData.id, not the whole object

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Nama kolam harus minimal 3 karakter";
    }

    if (!formData.location || formData.location.trim().length < 3) {
      newErrors.location = "Lokasi kolam harus minimal 3 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Kolam" : "Tambah Kolam Baru"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Perbarui informasi kolam"
              : "Buat kolam baru untuk monitoring"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div className="space-y-2">
            <Label htmlFor="pond-name">Nama Kolam *</Label>
            <Input
              id="pond-name"
              name="pond-name"
              autoComplete="off"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Contoh: Kolam A1"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pond-location">Lokasi *</Label>
            <Input
              id="pond-location"
              name="pond-location"
              autoComplete="off"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Contoh: Blok Utara"
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pond-description">Deskripsi</Label>
            <Textarea
              id="pond-description"
              name="pond-description"
              autoComplete="off"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              onBlur={(e) => {
                e.stopPropagation();
              }}
              placeholder="Deskripsi kolam (opsional)..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editData ? "Perbarui" : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export function PondManagementPage({ onNavigate }) {
  // State management
  const [ponds, setPonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPonds();
  }, []);

  const fetchPonds = async () => {
    try {
      setRefreshing(true);
      const result = await pondService.getAllPonds();

      if (result.success) {
        setPonds(result.data);
      } else {
        toast.error(result.message || "Gagal memuat data kolam");
      }
    } catch (error) {
      toast.error("Gagal memuat data kolam");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreatePond = async (formData) => {
    try {
      setFormLoading(true);
      const result = await pondService.createPond(formData);

      if (result.success) {
        toast.success(result.message || "Kolam berhasil ditambahkan");
        setShowForm(false);
        fetchPonds();
      } else {
        toast.error(result.message || "Gagal menambahkan kolam");
      }
    } catch (error) {
      toast.error("Gagal menambahkan kolam");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePond = async (pondId) => {
    try {
      setDeleting(true);
      const result = await pondService.deletePond(pondId);

      if (result.success) {
        toast.success(result.message || "Kolam berhasil dihapus");
        setDeleteConfirm(null);
        fetchPonds();
      } else {
        toast.error(result.message || "Gagal menghapus kolam");
      }
    } catch (error) {
      toast.error("Gagal menghapus kolam");
    } finally {
      setDeleting(false);
    }
  };

  // Filter ponds
  const filteredPonds = ponds.filter((pond) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pond.name?.toLowerCase().includes(searchLower) ||
      pond.location?.toLowerCase().includes(searchLower) ||
      pond.description?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate statistics
  const stats = {
    total: ponds.length,
    active: ponds.length, // Semua kolam dianggap aktif untuk sekarang
    locations: [...new Set(ponds.map((p) => p.location))].length,
    recent: ponds.filter((p) => {
      const createdDate = new Date(p.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate >= thirtyDaysAgo;
    }).length,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar
          onNavigate={onNavigate}
          currentPage="pond-management"
        />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
              <span>Memuat data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar onNavigate={onNavigate} currentPage="pond-management" />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-foreground mb-2">Manajemen Kolam</h1>
            <p className="text-muted-foreground">
              Kelola data kolam budidaya ikan nila
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Kolam</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.total}
                    </p>
                  </div>
                  <Waves className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Kolam Aktif</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.active}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Lokasi</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.locations}
                    </p>
                  </div>
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Baru (30 Hari)
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.recent}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex flex-1">
              <Input
                id="search-ponds"
                name="search-ponds"
                placeholder="Cari kolam berdasarkan nama atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
                aria-label="Cari kolam"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={fetchPonds}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kolam
              </Button>
            </div>
          </div>

          {/* Ponds Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kolam ({filteredPonds.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kolam</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPonds.length > 0 ? (
                    filteredPonds.map((pond) => (
                      <TableRow key={pond.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Waves className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{pond.name}</p>
                              <p className="text-sm text-muted-foreground">
                                ID: {pond.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            {pond.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                            {pond.description || "Tidak ada deskripsi"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(pond.created_at)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-600 text-white">
                            Aktif
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(pond)}
                              className="text-red-600 hover:text-red-700"
                              aria-label={`Hapus kolam ${pond.name}`}
                              title={`Hapus kolam ${pond.name}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {searchTerm
                            ? "Tidak ada kolam yang cocok dengan pencarian"
                            : "Belum ada kolam"}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Form Dialog */}
          <PondForm
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
            }}
            onSubmit={handleCreatePond}
            editData={null}
            loading={formLoading}
          />

          {/* Delete Confirmation */}
          <AlertDialog
            open={!!deleteConfirm}
            onOpenChange={() => setDeleteConfirm(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Kolam</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus kolam{" "}
                  <strong>{deleteConfirm?.name}</strong>? Semua data monitoring
                  dan jadwal pakan terkait kolam ini akan terpengaruh. Tindakan
                  ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeletePond(deleteConfirm.id)}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
