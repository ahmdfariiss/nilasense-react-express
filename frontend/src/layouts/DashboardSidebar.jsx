import {
  LayoutDashboard,
  Droplet,
  UtensilsCrossed,
  Package,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { SidebarMenuItem } from '../fragments/SidebarMenuItem';

export function DashboardSidebar({ onNavigate, currentPage }) {
  const sidebarItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', active: currentPage === 'admin-dashboard', page: 'admin-dashboard' },
    { icon: <Droplet className="w-5 h-5" />, label: 'Monitoring Air', active: currentPage === 'water-monitoring', page: 'water-monitoring' },
    { icon: <UtensilsCrossed className="w-5 h-5" />, label: 'Manajemen Pakan', active: currentPage === 'feed-management', page: 'feed-management' },
    { icon: <Package className="w-5 h-5" />, label: 'Manajemen Produk', active: currentPage === 'product-management', page: 'product-management' },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Pesanan Masuk', active: currentPage === 'orders', page: 'orders' },
    { icon: <Users className="w-5 h-5" />, label: 'Manajemen User', active: currentPage === 'user-management', page: 'user-management' },
  ];

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-border">
      <div className="p-6">
        <h2 className="text-foreground mb-1">Admin Panel</h2>
        <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
          Kelola budidaya Anda
        </p>
      </div>
      <nav className="px-3 space-y-1">
        {sidebarItems.map((item, index) => (
          <SidebarMenuItem
            key={index}
            icon={item.icon}
            label={item.label}
            active={item.active}
            onClick={() => onNavigate(item.page)}
          />
        ))}
      </nav>
    </aside>
  );
}
