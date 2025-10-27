import { useState, useEffect } from "react";
import { Navbar } from "./layouts/Navbar";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// Auth pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

// Public pages
import { WelcomePage } from "./pages/public/WelcomePage";
import { ProductsPage } from "./pages/public/ProductsPage";
import { ProductDetailPage } from "./pages/public/ProductDetailPage";

// Admin pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { WaterMonitoringPage } from "./pages/admin/WaterMonitoringPage";
import { FeedManagementPage } from "./pages/admin/FeedManagementPage";
import { ProductManagementPage } from "./pages/admin/ProductManagementPage";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { PondManagementPage } from "./pages/admin/PondManagementPage";

// Buyer pages (E-commerce only)
import { CartPage } from "./pages/buyer/CartPage";
import { CheckoutPage } from "./pages/buyer/CheckoutPage";
import { OrderHistoryPage } from "./pages/buyer/OrderHistoryPage";
import { OrderDetailPage } from "./pages/buyer/OrderDetailPage";
import { OrderManagementPage } from "./pages/admin/OrderManagementPage";

// Monitoring pages (for admin & petambak only)
import { UserMonitoringPage } from "./pages/buyer/UserMonitoringPage";
import { WaterQualityPage } from "./pages/buyer/WaterQualityPage";
import { FeedSchedulePage } from "./pages/buyer/FeedSchedulePage";

// Hooks & Contexts
import { useAuth } from "./contexts/AuthContext";
import { useDialogFix } from "./hooks/useDialogFix";

export default function App() {
  const { user, loading, logout } = useAuth();

  // Apply dialog visibility fix globally
  useDialogFix();

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
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleNavigate = (page, id) => {
    setCurrentPage(page);

    // Handle different types of IDs
    if (id) {
      if (page === "product-detail") {
        setSelectedProductId(id);
      } else if (page === "order-detail") {
        setSelectedOrderId(id);
      }
    }

    // Update URL without reload
    const path = getPathFromPage(page);
    if (window.location.pathname !== path) {
      window.history.pushState({ page, id }, "", path);
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.id) {
          if (event.state.page === "product-detail") {
            setSelectedProductId(event.state.id);
          } else if (event.state.page === "order-detail") {
            setSelectedOrderId(event.state.id);
          }
        }
      } else {
        setCurrentPage(getPageFromPath(window.location.pathname));
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", handlePopState);

    // Set initial state
    window.history.replaceState(
      { page: currentPage },
      "",
      window.location.pathname
    );

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleLogin = (email, password, role) => {
    // Navigation setelah login berhasil
    if (role === "admin" || role === "petambak") {
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
    // Skip check if auth is still loading
    if (loading) return;

    // Pages that require login
    const loginRequiredPages = [
      // Admin & Petambak pages
      "monitoring",
      "water-quality",
      "feed-schedule",
      "admin-dashboard",
      "water-monitoring",
      "feed-management",
      "product-management",
      "orders",
      "user-management",
      "pond-management",
      "order-management",
      // Buyer pages (E-commerce only)
      "cart",
      "checkout",
      "order-history",
      "order-detail",
      "profile",
    ];

    if (loginRequiredPages.includes(currentPage) && !user) {
      toast.error("Akses ditolak", {
        description: "Silakan login terlebih dahulu",
      });
      handleNavigate("login");
      return;
    }

    // Pages accessible by both admin and petambak (including monitoring)
    const adminAndPetambakPages = [
      "admin-dashboard",
      "water-monitoring",
      "feed-management",
      "product-management",
      "pond-management",
      "orders",
      "order-management",
      "monitoring",
      "water-quality",
      "feed-schedule",
    ];

    // Check if buyer/guest tries to access admin/petambak-only pages
    if (adminAndPetambakPages.includes(currentPage)) {
      if (user?.role !== "admin" && user?.role !== "petambak") {
        toast.error("Akses ditolak", {
          description: "Halaman ini hanya untuk admin dan petambak",
        });
        handleNavigate("home");
      }
    }

    // User management is ADMIN ONLY (petambak cannot access)
    if (currentPage === "user-management" && user?.role !== "admin") {
      toast.error("Akses ditolak", {
        description: "Halaman ini hanya untuk admin utama",
      });
      handleNavigate("admin-dashboard");
    }
  }, [currentPage, user, loading]);

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

      case "feed-management":
        return <FeedManagementPage onNavigate={handleNavigate} />;

      case "product-management":
        return <ProductManagementPage onNavigate={handleNavigate} />;

      case "user-management":
        return <UserManagementPage onNavigate={handleNavigate} />;

      case "order-management":
        return <OrderManagementPage onNavigate={handleNavigate} />;

      case "pond-management":
        return <PondManagementPage onNavigate={handleNavigate} />;

      case "monitoring":
        return <UserMonitoringPage onNavigate={handleNavigate} />;

      case "water-quality":
        return <WaterQualityPage onNavigate={handleNavigate} />;

      case "feed-schedule":
        return <FeedSchedulePage onNavigate={handleNavigate} />;

      case "cart":
        return <CartPage onNavigate={handleNavigate} />;

      case "checkout":
        return <CheckoutPage onNavigate={handleNavigate} />;

      case "order-history":
        return <OrderHistoryPage onNavigate={handleNavigate} />;

      case "order-detail":
        return (
          <OrderDetailPage
            orderId={selectedOrderId}
            onNavigate={handleNavigate}
          />
        );

      case "orders":
        return <OrderManagementPage onNavigate={handleNavigate} />;

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
                    userRole === "admin" || userRole === "petambak"
                      ? "admin-dashboard"
                      : "home"
                  )
                }
                className="text-primary hover:underline"
              >
                Kembali ke{" "}
                {userRole === "admin" || userRole === "petambak"
                  ? "Dashboard"
                  : "Halaman Utama"}
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
