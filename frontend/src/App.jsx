import { useState, useEffect } from "react";
import { Navbar } from "./layouts/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { WelcomePage } from "./pages/WelcomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

import { ProductDetailPage } from "./pages/ProductDetailPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { WaterMonitoringPage } from "./pages/WaterMonitoringPage";
import { UserMonitoringPage } from "./pages/UserMonitoringPage";
import { WaterQualityPage } from "./pages/WaterQualityPage";
import { FeedSchedulePage } from "./pages/FeedSchedulePage";
import { FeedManagementPage } from "./pages/FeedManagementPage";

// Import useAuth hook
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { user, loading, logout } = useAuth();
  
  // Function to convert path to page name
  const getPageFromPath = (pathname) => {
    // Remove leading slash
    const path = pathname.slice(1) || "home";
    return path;
  };

  // Function to convert page name to path
  const getPathFromPage = (page) => {
    return page === "home" ? "/" : `/${page}`;
  };

  // Initialize currentPage from URL
  const [currentPage, setCurrentPage] = useState(() => {
    return getPageFromPath(window.location.pathname);
  });
  const [selectedProductId, setSelectedProductId] = useState(1);

  const handleNavigate = (page, productId) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
    
    // Update URL without reload
    const path = getPathFromPage(page);
    if (window.location.pathname !== path) {
      window.history.pushState({ page, productId }, "", path);
    }
    
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.productId) {
          setSelectedProductId(event.state.productId);
        }
      } else {
        setCurrentPage(getPageFromPath(window.location.pathname));
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", handlePopState);
    
    // Set initial state
    window.history.replaceState({ page: currentPage }, "", window.location.pathname);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleLogin = (email, password, role) => {
    // Navigation setelah login berhasil
    if (role === "admin") {
      handleNavigate("admin-dashboard");
    } else {
      handleNavigate("home");
    }
  };

  const handleRegister = (name, email, password) => {
    // Navigation setelah register berhasil
    handleNavigate("home");
  };

  const handleLogout = () => {
    logout();
    toast.info("Anda telah logout", {
      description: "Sampai jumpa lagi!",
    });
    handleNavigate("home");
  };

  // Determine user role - gunakan data dari context
  const userRole = user?.role || "guest";

  // Redirect to login if trying to access protected pages
  useEffect(() => {
    // Pages that require login (user or admin)
    const loginRequiredPages = [
      "monitoring",
      "water-quality",
      "feed-schedule",
      "admin-dashboard",
      "water-monitoring",
      "feed-management",
      "product-management",
      "orders",
      "user-management",
      "profile",
    ];

    if (loginRequiredPages.includes(currentPage) && !user) {
      toast.error("Akses ditolak", {
        description: "Silakan login terlebih dahulu",
      });
      handleNavigate("login");
      return;
    }

    // Pages that are admin-only
    const adminOnlyPages = [
      "admin-dashboard",
      "water-monitoring",
      "feed-management",
      "product-management",
      "orders",
      "user-management",
    ];

    if (adminOnlyPages.includes(currentPage) && user?.role === "buyer") {
      toast.error("Akses ditolak", {
        description: "Halaman ini hanya untuk admin",
      });
      handleNavigate("monitoring");
    }

    // Redirect old monitoring page to new structure
    if (currentPage === "monitoring" && user?.role === "admin") {
      handleNavigate("admin-dashboard");
    }
  }, [currentPage, user]);

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;

      case "register":
        return (
          <RegisterPage
            onRegister={handleRegister}
            onNavigate={handleNavigate}
          />
        );

      case "home":
        return <WelcomePage onNavigate={handleNavigate} userRole={userRole} />;

      case "products":
        return <ProductsPage onNavigate={handleNavigate} />;

      case "product-detail":
        return (
          <ProductDetailPage
            productId={selectedProductId}
            onNavigate={handleNavigate}
          />
        );

      case "admin-dashboard":
        return <AdminDashboard onNavigate={handleNavigate} />;

      case "water-monitoring":
        return <WaterMonitoringPage onNavigate={handleNavigate} />;

      case "monitoring":
        // User monitoring dashboard (hub page)
        return <UserMonitoringPage />;

      case "water-quality":
        // Direct access to water quality monitoring
        return <WaterQualityPage showBreadcrumb={true} onNavigate={handleNavigate} />;

      case "feed-schedule":
        // Direct access to feed schedule
        return <FeedSchedulePage showBreadcrumb={true} onNavigate={handleNavigate} />;

      case "feed-management":
        return <FeedManagementPage onNavigate={handleNavigate} />;

      case "product-management":
      case "orders":
      case "user-management":
      case "profile":
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🚧</span>
              </div>
              <h2 className="text-foreground mb-4">
                Halaman Dalam Pengembangan
              </h2>
              <p className="text-muted-foreground mb-6">
                Halaman{" "}
                {currentPage
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}{" "}
                sedang dalam tahap pengembangan.
              </p>
              <button
                onClick={() =>
                  handleNavigate(
                    userRole === "admin" ? "admin-dashboard" : "home"
                  )
                }
                className="text-primary hover:underline"
              >
                Kembali ke{" "}
                {userRole === "admin" ? "Dashboard" : "Halaman Utama"}
              </button>
            </div>
          </div>
        );

      default:
        return <WelcomePage onNavigate={handleNavigate} userRole={userRole} />;
    }
  };

  const showNavbar = !["login", "register"].includes(currentPage);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && (
        <Navbar
          userRole={userRole}
          userName={user?.name}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      {renderPage()}
      <Toaster />
    </div>
  );
}
