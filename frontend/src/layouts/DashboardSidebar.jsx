import { useState } from "react";
import {
  LayoutDashboard,
  Droplet,
  UtensilsCrossed,
  Package,
  ShoppingBag,
  Users,
  Waves,
  Menu,
} from "lucide-react";
import { SidebarMenuItem } from "@/components/common/SidebarMenuItem";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function DashboardSidebar({ onNavigate, currentPage }) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Base menu items for all roles
  const baseItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      active: currentPage === "admin-dashboard",
      page: "admin-dashboard",
    },
    {
      icon: <Waves className="w-5 h-5" />,
      label: "Manajemen Kolam",
      active: currentPage === "pond-management",
      page: "pond-management",
    },
    {
      icon: <Droplet className="w-5 h-5" />,
      label: "Monitoring Air",
      active: currentPage === "water-monitoring",
      page: "water-monitoring",
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5" />,
      label: "Manajemen Pakan",
      active: currentPage === "feed-management",
      page: "feed-management",
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Manajemen Produk",
      active: currentPage === "product-management",
      page: "product-management",
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Manajemen Pesanan",
      active: currentPage === "order-management",
      page: "order-management",
    },
  ];

  // Admin-only items
  const adminOnlyItems = [
    {
      icon: <Users className="w-5 h-5" />,
      label: "Manajemen User",
      active: currentPage === "user-management",
      page: "user-management",
    },
  ];

  // Combine items based on role
  const sidebarItems =
    user?.role === "admin" ? [...baseItems, ...adminOnlyItems] : baseItems;

  const handleMenuItemClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Shared sidebar content
  const SidebarContent = () => (
    <>
      <div className="p-6">
        <h2 className="text-foreground mb-1">
          {user?.role === "petambak" ? "Panel Petambak" : "Admin Panel"}
        </h2>
        <p className="text-muted-foreground text-sm">Kelola budidaya Anda</p>
      </div>
      <nav className="px-3 space-y-1">
        {sidebarItems.map((item, index) => (
          <SidebarMenuItem
            key={index}
            icon={item.icon}
            label={item.label}
            active={item.active}
            onClick={() => handleMenuItemClick(item.page)}
          />
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          className="bg-white shadow-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-border overflow-y-auto z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
