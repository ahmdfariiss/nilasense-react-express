import { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, Shield, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/layouts/AdminLayout';

export function AdminUserManagementPage() {
  return (
    <AdminLayout 
      title="Manajemen User" 
      subtitle="Kelola pengguna dan hak akses sistem"
    >
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Halaman Dalam Pengembangan
        </h2>
        <p className="text-muted-foreground mb-6">
          Fitur manajemen user sedang dalam tahap pengembangan dan akan segera tersedia.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Daftar semua pengguna dengan role</p>
          <p>• Edit informasi pengguna</p>
          <p>• Ubah role pengguna (admin/buyer)</p>
          <p>• Nonaktifkan/aktifkan akun pengguna</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUserManagementPage;