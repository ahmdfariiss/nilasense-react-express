import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown, Droplet, UtensilsCrossed, BarChart3, Home, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const userRole = user?.role || "guest";
  const userName = user?.name;
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [monitoringDropdownOpen, setMonitoringDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const monitoringRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monitoringRef.current && !monitoringRef.current.contains(event.target)) {
        setMonitoringDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.info("Anda telah logout", {
      description: "Sampai jumpa lagi!",
    });
    navigate("/");
  };

  const navLinks = [
    { name: "Halaman Utama", path: "/", roles: ["guest", "buyer", "admin"], icon: Home },
    { name: "Produk", path: "/products", roles: ["guest", "buyer", "admin"], icon: Package },
  ];

  const monitoringLinks = [
    { name: "Dashboard Monitoring", path: "/dashboard", icon: BarChart3, roles: ["buyer"] },
    { name: "Kualitas Air", path: "/monitoring/water-quality", icon: Droplet, roles: ["buyer"] },
    { name: "Jadwal Pakan", path: "/monitoring/feed-schedule", icon: UtensilsCrossed, roles: ["buyer"] },
    { name: "Admin Overview", path: "/admin/overview", icon: BarChart3, roles: ["admin"] },
    { name: "Water Monitoring (Admin)", path: "/admin/monitoring/water", icon: Droplet, roles: ["admin"] },
    { name: "Feed Management (Admin)", path: "/admin/monitoring/feeds", icon: UtensilsCrossed, roles: ["admin"] },
  ];

  const visibleNavLinks = navLinks.filter((link) => link.roles.includes(userRole));
  const visibleMonitoringLinks = monitoringLinks.filter((link) => link.roles.includes(userRole));

  // Check if current page is any monitoring related page
  const isMonitoringActive = location.pathname.includes('/monitoring') || 
                            location.pathname.includes('/dashboard') ||
                            location.pathname.includes('/admin');

  // Get current monitoring page name for display
  const getCurrentMonitoringPageName = () => {
    const currentLink = monitoringLinks.find(link => location.pathname === link.path);
    return currentLink ? currentLink.name : "Monitoring Kolam";
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <Droplet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">NilaSense</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Regular Nav Links */}
            {visibleNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}

            {/* Monitoring Dropdown */}
            {visibleMonitoringLinks.length > 0 && (
              <div className="relative" ref={monitoringRef}>
                <button
                  onClick={() => setMonitoringDropdownOpen(!monitoringDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isMonitoringActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {isMonitoringActive ? getCurrentMonitoringPageName() : "Monitoring Kolam"}
                  <ChevronDown className={`w-4 h-4 transition-transform ${monitoringDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {monitoringDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50 min-w-max">
                    {visibleMonitoringLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMonitoringDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <link.icon className="w-4 h-4" />
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <User className="w-4 h-4" />
                  {userName}
                  <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-foreground">{userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {userRole === 'admin' ? 'Administrator' : 'Pembeli'}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Regular Nav Links */}
              {visibleNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}

              {/* Monitoring Links */}
              {visibleMonitoringLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}

              {/* User Actions */}
              {user ? (
                <div className="border-t border-border pt-4 mt-4">
                  <div className="px-3 py-2">
                    <p className="text-base font-medium text-foreground">{userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {userRole === 'admin' ? 'Administrator' : 'Pembeli'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-border pt-4 mt-4 space-y-1">
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}