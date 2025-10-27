import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Loader2,
  Shield,
  ShoppingBag,
  UserCircle,
  Mail,
  Calendar,
  Waves,
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
import userService from "@/services/userService";
import pondService from "@/services/pondService";
import { toast } from "sonner";
import { DashboardSidebar } from "@/layouts/DashboardSidebar";

// Form component for creating/editing users
const UserForm = ({ isOpen, onClose, onSubmit, editData, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
    pond_id: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [ponds, setPonds] = useState([]);
  const [loadingPonds, setLoadingPonds] = useState(false);

  // Fetch ponds when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchPonds = async () => {
        setLoadingPonds(true);
        try {
          const response = await pondService.getAllPonds();
          if (response.success && Array.isArray(response.data)) {
            setPonds(response.data);
          } else {
            console.error("Invalid ponds data:", response);
            setPonds([]);
            toast.error(response.message || "Gagal memuat daftar kolam");
          }
        } catch (error) {
          console.error("Error fetching ponds:", error);
          setPonds([]);
          toast.error("Gagal memuat daftar kolam");
        } finally {
          setLoadingPonds(false);
        }
      };
      fetchPonds();
    }
  }, [isOpen]);

  // Reset form when modal opens/closes, based on editData
  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "buyer",
        pond_id: "",
      });
      setErrors({});
      return;
    }

    // When modal opens, populate form based on editData
    if (isOpen && editData) {
      setFormData({
        name: editData.name || "",
        email: editData.email || "",
        password: "", // Don't populate password for edit
        role: editData.role || "buyer",
        pond_id: editData.pond_id ? editData.pond_id.toString() : "",
      });
      setErrors({});
    } else if (isOpen && !editData) {
      // Modal opened for creating new user
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "buyer",
        pond_id: "",
      });
      setErrors({});
    }
  }, [isOpen, editData?.id]); // Only depend on editData.id, not the whole object

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const submitData = { ...formData };

    // Remove password if empty in edit mode
    if (editData && !formData.password) {
      delete submitData.password;
    }

    // Convert pond_id: empty string to null, or parse to integer
    if (submitData.pond_id === "" || submitData.pond_id === "none") {
      submitData.pond_id = null;
    } else if (submitData.pond_id) {
      submitData.pond_id = parseInt(submitData.pond_id, 10);
    }

    // Validate that petambak has a pond assigned
    if (submitData.role === "petambak" && !submitData.pond_id) {
      setErrors({ pond_id: "Petambak harus di-assign ke kolam" });
      return;
    }

    const validation = userService.validateUserData(submitData, !!editData);
    if (!validation.isValid) {
      const newErrors = {};
      validation.errors.forEach((error) => {
        if (error.includes("Nama")) newErrors.name = error;
        if (error.includes("Email")) newErrors.email = error;
        if (error.includes("Password")) newErrors.password = error;
        if (error.includes("Role")) newErrors.role = error;
      });
      setErrors(newErrors);
      return;
    }

    onSubmit(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit User" : "Tambah User Baru"}
          </DialogTitle>
          <DialogDescription>
            {editData ? "Perbarui informasi user" : "Buat akun user baru"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div className="space-y-2">
            <Label htmlFor="user-name">Nama Lengkap *</Label>
            <Input
              id="user-name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Masukkan nama lengkap"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-email">Email *</Label>
            <Input
              id="user-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="user@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-password">
              Password{" "}
              {editData ? "(kosongkan jika tidak ingin mengubah)" : "*"}
            </Label>
            <Input
              id="user-password"
              name="password"
              type="password"
              autoComplete={editData ? "off" : "new-password"}
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder={
                editData ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"
              }
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-role">Role *</Label>
            <Select
              name="role"
              value={formData.role}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, role: value, pond_id: "" }));
                setErrors((prev) => ({ ...prev, pond_id: "" }));
              }}
            >
              <SelectTrigger id="user-role" aria-label="Pilih role user">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Pembeli</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Administrator</span>
                  </div>
                </SelectItem>
                <SelectItem value="petambak">
                  <div className="flex items-center gap-2">
                    <Waves className="w-4 h-4" />
                    <span>Petambak</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          {/* Pond Selection - Only for Petambak Role */}
          {formData.role === "petambak" && (
            <div className="space-y-2">
              <Label htmlFor="user-pond">Kolam * (Wajib untuk Petambak)</Label>
              <Select
                name="pond"
                value={formData.pond_id || "none"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    pond_id: value === "none" ? "" : value,
                  }))
                }
                disabled={loadingPonds}
              >
                <SelectTrigger
                  id="user-pond"
                  aria-label="Pilih kolam untuk petambak"
                >
                  <SelectValue
                    placeholder={
                      loadingPonds ? "Memuat kolam..." : "Pilih kolam"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground">
                      -- Pilih Kolam --
                    </span>
                  </SelectItem>
                  {Array.isArray(ponds) && ponds.length > 0 ? (
                    ponds.map((pond) => (
                      <SelectItem key={pond.id} value={pond.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Waves className="w-4 h-4" />
                          <span>
                            {pond.name} - {pond.location}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-ponds" disabled>
                      <span className="text-muted-foreground">
                        {loadingPonds
                          ? "Memuat..."
                          : "Tidak ada kolam tersedia"}
                      </span>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.pond_id && (
                <p className="text-sm text-red-500">{errors.pond_id}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Petambak hanya dapat mengelola 1 kolam yang di-assign
              </p>
            </div>
          )}

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

export function UserManagementPage({ onNavigate }) {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const result = await userService.getAllUsers();

      if (result.success) {
        setUsers(result.data);
      } else {
        toast.error(result.message || "Gagal memuat data users");
      }
    } catch (error) {
      toast.error("Gagal memuat data users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      setFormLoading(true);
      const result = await userService.createUser(formData);

      if (result.success) {
        toast.success(result.message || "User berhasil ditambahkan");
        setShowForm(false);
        fetchUsers();
      } else {
        toast.error(result.message || "Gagal menambahkan user");
      }
    } catch (error) {
      toast.error("Gagal menambahkan user");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setDeleting(true);
      const result = await userService.deleteUser(userId);

      if (result.success) {
        toast.success(result.message || "User berhasil dihapus");
        setDeleteConfirm(null);
        fetchUsers();
      } else {
        toast.error(result.message || "Gagal menghapus user");
      }
    } catch (error) {
      toast.error("Gagal menghapus user");
    } finally {
      setDeleting(false);
    }
  };

  // Filter users
  let filteredUsers = userService.filterByRole(users, selectedRole);
  filteredUsers = userService.searchUsers(filteredUsers, searchTerm);

  // Calculate statistics
  const stats = userService.getUserStatistics(users);

  const getRoleIcon = (role) => {
    return role === "admin" ? (
      <Shield className="w-4 h-4" />
    ) : (
      <ShoppingBag className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar
          onNavigate={onNavigate}
          currentPage="user-management"
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
      <DashboardSidebar onNavigate={onNavigate} currentPage="user-management" />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-foreground mb-2">Manajemen User</h1>
            <p className="text-muted-foreground">
              Kelola akun pengguna dan hak akses
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.total}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Administrator
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.admins}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Pembeli</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.buyers}
                    </p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-green-600" />
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
                      {stats.recentRegistrations}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex flex-1 gap-4">
              <div className="flex-1">
                <Input
                  id="search-users"
                  name="search-users"
                  placeholder="Cari nama atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                  aria-label="Cari user"
                />
              </div>

              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                name="filter-role"
              >
                <SelectTrigger
                  id="filter-role"
                  className="w-[180px]"
                  aria-label="Filter role pengguna"
                >
                  <SelectValue placeholder="Filter role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="petambak">Petambak</SelectItem>
                  <SelectItem value="buyer">Pembeli</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={fetchUsers}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah User
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar User ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <UserCircle className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                ID: {user.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={userService.getRoleBadgeClass(user.role)}
                          >
                            <span className="flex items-center gap-1">
                              {getRoleIcon(user.role)}
                              {userService.getRoleLabel(user.role)}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {userService.formatRegistrationDate(
                              user.created_at
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(user)}
                              className="text-red-600 hover:text-red-700"
                              aria-label={`Hapus user ${user.name}`}
                              title={`Hapus user ${user.name}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {searchTerm || selectedRole !== "all"
                            ? "Tidak ada user yang cocok dengan filter"
                            : "Belum ada user"}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Form Dialog */}
          <UserForm
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
            }}
            onSubmit={handleCreateUser}
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
                <AlertDialogTitle>Hapus User</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus user{" "}
                  <strong>{deleteConfirm?.name}</strong>({deleteConfirm?.email}
                  )? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteUser(deleteConfirm.id)}
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
