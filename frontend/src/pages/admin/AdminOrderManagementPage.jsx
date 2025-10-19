import { useState, useEffect } from 'react';
import { ShoppingBag, Eye, CheckCircle, Clock, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/layouts/AdminLayout';

export function AdminOrderManagementPage() {
  return (
    <AdminLayout 
      title="Manajemen Pesanan" 
      subtitle="Kelola pesanan masuk dan status pengiriman"
    >
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Halaman Dalam Pengembangan
        </h2>
        <p className="text-muted-foreground mb-6">
          Fitur manajemen pesanan sedang dalam tahap pengembangan dan akan segera tersedia.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Daftar pesanan dengan filter status</p>
          <p>• Update status pesanan (pending, diproses, dikirim, selesai)</p>
          <p>• Detail pesanan dan informasi pelanggan</p>
          <p>• Laporan penjualan dan statistik</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrderManagementPage;