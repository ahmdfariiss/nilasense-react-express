import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Filter,
  Download,
  Shield,
  User,
  AlertCircle,
  Loader2,
  Eye,
  Mail,
  Calendar,
  Crown,
  ShoppingCart
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
import userService from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';

// Loading skeleton component
function UserTableLoading() {
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
function EmptyState({ searchTerm, onClearSearch }) {
  return (
    <div className="text-center py-12">
      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {searchTerm ? 'Tidak ada pengguna yang cocok' : 'Belum ada pengguna'}
      </h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm 
          ? `Tidak ditemukan pengguna dengan kata kunci "${searchTerm}"`
          : 'Belum ada pengguna terdaftar dalam sistem'
        }
      </p>
      {searchTerm && (
        <Button variant="outline" onClick={onClearSearch}>
          Hapus Filter
        </Button>
      )}
    </div>
  );
}

// User Form Component
function UserForm({ isOpen, onClose, onSubmit, editData, loading, currentUserId, allUsers }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'buyer'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        email: editData.email || '',
        role: editData.role || 'buyer'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'buyer'
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = userService.validateUserData(formData);
    if (!validation.isValid) {
      const newErrors = {};
      validation.errors.forEach(error => {
        if (error.includes('Nama')) newErrors.name = error;
        if (error.includes('Email')) newErrors.email = error;
        if (error.includes('Role')) newErrors.role = error;
      });
      setErrors(newErrors);
      return;
    }

    // Check if role can be changed
    if (editData) {
      const roleCheck = userService.canChangeRole(editData, formData.role, currentUserId, allUsers);
      if (!roleCheck.canChange) {
        toast.error(roleCheck.reason);
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
          </DialogTitle>
          <DialogDescription>
            {editData 
              ? 'Perbarui informasi pengguna'
              : 'Tambahkan pengguna baru ke sistem'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Pembeli
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Administrator
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
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

// User Detail Modal
function UserDetailModal({ isOpen, onClose, user }) {
  if (!user) return null;

  const formatted = userService.formatUserData(user);
  const roleBadge = userService.getRoleBadgeConfig(user.role);
  const activitySummary = userService.getUserActivitySummary(user);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {user.role === 'admin' ? (
              <Shield className="w-5 h-5 text-blue-600" />
            ) : (
              <User className="w-5 h-5 text-green-600" />
            )}
            {user.name}
          </DialogTitle>
          <DialogDescription>
            Detail informasi pengguna
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Nama Lengkap</Label>
              <p className="text-foreground">{user.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Role</Label>
              <div className="mt-1">
                <Badge variant="outline" className={roleBadge.className}>
                  {roleBadge.label}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Email</Label>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <p className="text-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tanggal Bergabung</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-foreground text-sm">{formatted.created_at_formatted}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">ID Pengguna</Label>
              <p className="text-foreground font-mono">#{user.id}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Bergabung</Label>
            <p className="text-foreground text-sm">{userService.getTimeSinceRegistration(user.created_at)}</p>
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-muted-foreground mb-3 block">Ringkasan Aktivitas</Label>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Login Terakhir</p>
                <p className="text-foreground">{activitySummary.lastLogin}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Login</p>
                <p className="text-foreground">{activitySummary.totalLogins}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Kolam Dimiliki</p>
                <p className="text-foreground">{activitySummary.pondsOwned}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pesanan Dibuat</p>
                <p className="text-foreground">{activitySummary.ordersPlaced}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminUserManagementPage() {
  const { user: currentUser } = useAuth();
  
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Detail modal states
  const [showDetail, setShowDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Statistics
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    adminUsers: 0,
    buyerUsers: 0,
    recentUsers: 0
  });

  // Load users data
  const fetchUsers = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);

      const result = await userService.getAllUsers();
      
      if (result.success) {
        setUsers(result.data);
        
        // Calculate statistics
        const stats = userService.calculateStatistics(result.data);
        setStatistics(stats);
        
        if (showToast) {
          toast.success("Data pengguna berhasil diperbarui");
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    fetchUsers(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      let result;
      if (editingUser) {
        result = await userService.updateUser(editingUser.id, formData);
      } else {
        // For creating new users, we would need a different endpoint
        // For now, show message that this feature is not implemented
        toast.error("Fitur tambah pengguna baru belum diimplementasikan");
        return;
      }
      
      if (result.success) {
        toast.success(result.message);
        setShowForm(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(editingUser ? "Gagal memperbarui pengguna" : "Gagal menambah pengguna");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setDeleting(true);
      const result = await userService.deleteUser(userId);
      
      if (result.success) {
        toast.success(result.message);
        setDeleteConfirm(null);
        fetchUsers();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Gagal menghapus pengguna");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setRoleFilter('all');
  };

  const handleExportData = async () => {
    try {
      // Prepare CSV data
      const csvHeaders = ['ID', 'Nama', 'Email', 'Role', 'Tanggal Bergabung'];
      const csvData = filteredUsers.map(user => [
        user.id,
        user.name,
        user.email,
        user.role === 'admin' ? 'Administrator' : 'Pembeli',
        new Date(user.created_at).toLocaleDateString('id-ID')
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
      link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data berhasil diekspor");
    } catch (error) {
      toast.error("Gagal mengekspor data");
    }
  };

  // Filter and sort users
  let filteredUsers = userService.searchUsers(users, searchTerm);
  filteredUsers = userService.filterByRole(filteredUsers, roleFilter);
  filteredUsers = userService.sortUsers(filteredUsers, sortBy, sortOrder);

  if (loading) {
    return (
      <AdminLayout title="Manajemen User" subtitle="Kelola pengguna dan hak akses sistem">
        <UserTableLoading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manajemen User" subtitle="Kelola pengguna dan hak akses sistem">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Pengguna</p>
                  <p className="text-xl font-bold">{statistics.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Administrator</p>
                  <p className="text-xl font-bold">{statistics.adminUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pembeli</p>
                  <p className="text-xl font-bold">{statistics.buyerUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Baru (30 hari)</p>
                  <p className="text-xl font-bold">{statistics.recentUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="buyer">Pembeli</SelectItem>
              </SelectContent>
            </Select>

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
                <SelectItem value="email-asc">Email A-Z</SelectItem>
                <SelectItem value="email-desc">Email Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleExportData}
              disabled={filteredUsers.length === 0}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Memperbarui...' : 'Perbarui'}
            </Button>
            {/* Temporarily disabled until create user endpoint is implemented */}
            <Button onClick={handleAddUser} disabled>
              <UserPlus className="w-4 h-4 mr-2" />
              Tambah User
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Daftar Pengguna ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <EmptyState 
                searchTerm={searchTerm}
                onClearSearch={handleClearSearch}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pengguna</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Bergabung</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const formatted = userService.formatUserData(user);
                    const roleBadge = userService.getRoleBadgeConfig(user.role);
                    const deleteCheck = userService.canDeleteUser(user, currentUser?.id, users);
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              user.role === 'admin' ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              {user.role === 'admin' ? (
                                <Shield className="w-5 h-5 text-blue-600" />
                              ) : (
                                <User className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {user.name}
                                {user.id === currentUser?.id && (
                                  <span className="text-xs text-muted-foreground ml-2">(Anda)</span>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">ID: #{user.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={roleBadge.className}>
                            {roleBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground text-sm">
                              {formatted.created_at_formatted}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            Aktif
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetail(user)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              disabled={user.id === currentUser?.id}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm(user)}
                              disabled={!deleteCheck.canDelete}
                              className="text-red-600 hover:text-red-700 disabled:text-gray-400"
                              title={!deleteCheck.canDelete ? deleteCheck.reason : 'Hapus pengguna'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <UserForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          onSubmit={handleFormSubmit}
          editData={editingUser}
          loading={formLoading}
          currentUserId={currentUser?.id}
          allUsers={users}
        />

        {/* Detail Modal */}
        <UserDetailModal
          isOpen={showDetail}
          onClose={() => {
            setShowDetail(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Konfirmasi Hapus Pengguna
              </AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus pengguna <strong>"{deleteConfirm?.name}"</strong>?
                <br />
                <span className="text-red-600 font-medium">
                  Tindakan ini akan menghapus semua data yang terkait dengan pengguna ini.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteUser(deleteConfirm.id)}
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

export default AdminUserManagementPage;