import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Droplet,
  UtensilsCrossed,
  BarChart3,
  ShoppingCart,
  Package,
  LayoutDashboard,
  Waves,
  Users,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import cartService from "@/services/cartService";

export function Navbar({
  userRole,
  userName,
  currentPage,
  onNavigate,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [monitoringDropdownOpen, setMonitoringDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const monitoringRef = useRef(null);
  const adminRef = useRef(null);
  const userRef = useRef(null);

  // Track scroll position for blur effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch cart count from backend when user is buyer
  useEffect(() => {
    const fetchCartCount = async () => {
      if (userRole === "buyer") {
        const result = await cartService.getCartCount();
        if (result.success) {
          setCartCount(result.count);
        }
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();

    // Refresh cart count every 30 seconds if user is on cart-related pages
    const interval = setInterval(() => {
      if (userRole === "buyer") {
        fetchCartCount();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [userRole, currentPage]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        monitoringRef.current &&
        !monitoringRef.current.contains(event.target)
      ) {
        setMonitoringDropdownOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setAdminDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    {
      name: "Halaman Utama",
      page: "home",
      roles: ["guest", "buyer", "admin", "petambak"],
    },
    {
      name: "Produk",
      page: "products",
      roles: ["guest", "buyer", "admin", "petambak"],
    },
    {
      name: "Pesanan Saya",
      page: "order-history",
      roles: ["buyer"],
    },
  ];

  const monitoringLinks = [
    {
      name: "Dashboard Monitoring",
      page: "monitoring",
      icon: BarChart3,
      roles: ["admin", "petambak"], // Hanya admin & petambak
    },
    {
      name: "Kualitas Air",
      page: "water-quality",
      icon: Droplet,
      roles: ["admin", "petambak"], // Hanya admin & petambak
    },
    {
      name: "Jadwal Pakan",
      page: "feed-schedule",
      icon: UtensilsCrossed,
      roles: ["admin", "petambak"], // Hanya admin & petambak
    },
  ];

  const adminLinks = [
    {
      name: "Dashboard",
      page: "admin-dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "petambak"],
    },
    {
      name: "Manajemen Kolam",
      page: "pond-management",
      icon: Waves,
      roles: ["admin", "petambak"],
    },
    {
      name: "Monitoring Air",
      page: "water-monitoring",
      icon: Droplet,
      roles: ["admin", "petambak"],
    },
    {
      name: "Manajemen Pakan",
      page: "feed-management",
      icon: UtensilsCrossed,
      roles: ["admin", "petambak"],
    },
    {
      name: "Manajemen Produk",
      page: "product-management",
      icon: Package,
      roles: ["admin", "petambak"],
    },
    {
      name: "Manajemen Pesanan",
      page: "order-management",
      icon: ShoppingBag,
      roles: ["admin", "petambak"],
    },
    {
      name: "Manajemen User",
      page: "user-management",
      icon: Users,
      roles: ["admin"], // Only admin, not petambak
    },
  ];

  const visibleLinks = navLinks.filter((link) => link.roles.includes(userRole));
  const visibleMonitoringLinks = monitoringLinks.filter((link) =>
    link.roles.includes(userRole)
  );
  const visibleAdminLinks = adminLinks.filter((link) =>
    link.roles.includes(userRole)
  );

  // Check if current page is any monitoring related page
  const isMonitoringActive = [
    "monitoring",
    "water-quality",
    "feed-schedule",
  ].includes(currentPage);

  // Check if current page is any admin related page
  const isAdminActive = [
    "admin-dashboard",
    "pond-management",
    "water-monitoring",
    "feed-management",
    "product-management",
    "order-management",
    "user-management",
  ].includes(currentPage);

  // Get current monitoring page name for display
  const getCurrentMonitoringPageName = () => {
    switch (currentPage) {
      case "monitoring":
        return "Dashboard Monitoring";
      case "water-quality":
        return "Kualitas Air";
      case "feed-schedule":
        return "Jadwal Pakan";
      default:
        return "Monitoring Kolam";
    }
  };

  // Get current admin page name for display
  const getCurrentAdminPageName = () => {
    switch (currentPage) {
      case "admin-dashboard":
        return "Dashboard";
      case "pond-management":
        return "Manajemen Kolam";
      case "water-monitoring":
        return "Monitoring Air";
      case "feed-management":
        return "Manajemen Pakan";
      case "product-management":
        return "Manajemen Produk";
      case "order-management":
        return "Manajemen Pesanan";
      case "user-management":
        return "Manajemen User";
      default:
        return "Admin Dashboard";
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-border transition-all duration-300 ${
        isScrolled
          ? "bg-white/98 backdrop-blur-3xl backdrop-saturate-200 shadow-lg"
          : "bg-white shadow-sm"
      }`}
      style={
        isScrolled
          ? {
              backdropFilter: "blur(20px) saturate(200%)",
              WebkitBackdropFilter: "blur(20px) saturate(200%)",
            }
          : undefined
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="https://i.pinimg.com/originals/67/8d/2d/678d2d9fbfa87a9dd39466f35d349835.png"
                alt="NilaSense Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="text-primary tracking-tight"
              style={{ fontSize: "1.375rem", fontWeight: 700 }}
            >
              NilaSense
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {visibleLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`transition-colors ${
                  currentPage === link.page
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                } ${
                  link.page === "admin-dashboard"
                    ? "px-4 py-2 bg-primary/10 rounded-lg text-primary hover:bg-primary/20"
                    : ""
                }`}
              >
                {link.name}
              </button>
            ))}

            {/* Admin Dashboard Dropdown for Admin/Petambak */}
            {(userRole === "admin" || userRole === "petambak") &&
              visibleAdminLinks.length > 0 && (
                <div className="relative" ref={adminRef}>
                  <button
                    onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      isAdminActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {isAdminActive
                      ? getCurrentAdminPageName()
                      : "Admin Dashboard"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        adminDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Content */}
                  {adminDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50 min-w-max">
                      {visibleAdminLinks.map((link) => {
                        const IconComponent = link.icon;
                        const isActive = currentPage === link.page;
                        return (
                          <button
                            key={link.page}
                            onClick={() => {
                              onNavigate(link.page);
                              setAdminDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 transition-colors first:rounded-t-md last:rounded-b-md ${
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            <IconComponent
                              className={`w-4 h-4 ${
                                isActive ? "text-primary" : ""
                              }`}
                            />
                            {link.name}
                            {isActive && (
                              <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            {/* Monitoring Dropdown for Logged In Users */}
            {userRole !== "guest" && visibleMonitoringLinks.length > 0 && (
              <div className="relative" ref={monitoringRef}>
                <button
                  onClick={() =>
                    setMonitoringDropdownOpen(!monitoringDropdownOpen)
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    isMonitoringActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {isMonitoringActive
                    ? getCurrentMonitoringPageName()
                    : "Monitoring Kolam"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      monitoringDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Content */}
                {monitoringDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50 min-w-max">
                    {visibleMonitoringLinks.map((link) => {
                      const IconComponent = link.icon;
                      const isActive = currentPage === link.page;
                      return (
                        <button
                          key={link.page}
                          onClick={() => {
                            onNavigate(link.page);
                            setMonitoringDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 transition-colors first:rounded-t-md last:rounded-b-md ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          <IconComponent
                            className={`w-4 h-4 ${
                              isActive ? "text-primary" : ""
                            }`}
                          />
                          {link.name}
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Cart Icon for Buyers */}
            {userRole === "buyer" && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => onNavigate("cart")}
                aria-label="Keranjang belanja"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Auth Buttons for Guest */}
            {userRole === "guest" && (
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => onNavigate("login")}>
                  Masuk
                </Button>
                <Button
                  onClick={() => onNavigate("register")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Daftar
                </Button>
              </div>
            )}

            {/* User Menu for Logged In Users */}
            {userRole !== "guest" && (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/5 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{userName || "User"}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Content */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50 min-w-max">
                    <button
                      onClick={() => {
                        if (onLogout) onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 transition-colors text-gray-700 rounded-md"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {visibleLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => {
                    onNavigate(link.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${
                    currentPage === link.page
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </button>
              ))}

              {/* Mobile Monitoring Section */}
              {userRole !== "guest" && visibleMonitoringLinks.length > 0 && (
                <>
                  <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                    Monitoring Kolam
                  </div>
                  {visibleMonitoringLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <button
                        key={link.page}
                        onClick={() => {
                          onNavigate(link.page);
                          setMobileMenuOpen(false);
                        }}
                        className={`text-left px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          currentPage === link.page
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {link.name}
                      </button>
                    );
                  })}
                </>
              )}

              {userRole === "guest" ? (
                <div className="flex flex-col gap-2 mt-2 px-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onNavigate("login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Masuk
                  </Button>
                  <Button
                    onClick={() => {
                      onNavigate("register");
                      setMobileMenuOpen(false);
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Daftar
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2 px-4">
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span>{userName || "User"}</span>
                  </div>

                  {/* Cart Button for Buyers in Mobile */}
                  {userRole === "buyer" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        onNavigate("cart");
                        setMobileMenuOpen(false);
                      }}
                      className="relative"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Keranjang
                      {cartCount > 0 && (
                        <Badge className="ml-auto h-5 min-w-5 flex items-center justify-center px-1 text-xs bg-primary">
                          {cartCount}
                        </Badge>
                      )}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => {
                      if (onLogout) onLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
