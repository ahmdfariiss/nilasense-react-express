import { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Search, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/layouts/AdminLayout';

export function AdminProductManagementPage() {
  return (
    <AdminLayout 
      title="Manajemen Produk" 
      subtitle="Kelola produk yang dijual di platform"
    >
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Halaman Dalam Pengembangan
        </h2>
        <p className="text-muted-foreground mb-6">
          Fitur manajemen produk sedang dalam tahap pengembangan dan akan segera tersedia.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• CRUD produk dengan form validation</p>
          <p>• Upload gambar produk</p>
          <p>• Manajemen stok dan harga</p>
          <p>• Kategori dan filter produk</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProductManagementPage;