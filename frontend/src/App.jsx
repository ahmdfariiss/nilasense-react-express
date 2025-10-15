import { useState, useEffect } from "react";
import { Navbar } from "./layouts/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { WelcomePage } from "./pages/WelcomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// Ganti imports lama dengan imports baru dari folder /pages
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { WaterMonitoringPage } from "./pages/WaterMonitoringPage";
import { UserMonitoringPage } from "./pages/UserMonitoringPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(1);

  const handleNavigate = (page, productId) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (email, password, role) => {
    const userName = email.split("@")[0];
    setUser({
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email,
      role,
    });

    toast.success(`Selamat datang, ${userName}!`, {
      description: "Login berhasil",
    });

    // Navigate based on role
    if (role === "admin") {
      handleNavigate("admin-dashboard");
    } else {
      handleNavigate("home");
    }
  };

  const handleRegister = (name, email, password) => {
    setUser({
      name,
      email,
      role: "user",
    });

    toast.success(`Selamat datang, ${name}!`, {
      description: "Akun berhasil dibuat",
    });

    handleNavigate("home");
  };

  const handleLogout = () => {
    setUser(null);
    toast.info("Anda telah logout", {
      description: "Sampai jumpa lagi!",
    });
    handleNavigate("home");
  };

  const userRole = user?.role || "guest";

  // Redirect to login if trying to access protected pages
  useEffect(() => {
    // Pages that require login (user or admin)
    const loginRequiredPages = [
      "monitoring",
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

    if (adminOnlyPages.includes(currentPage) && user?.role === "user") {
      toast.error("Akses ditolak", {
        description: "Halaman ini hanya untuk admin",
      });
      handleNavigate("monitoring");
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
        // Show different monitoring page based on role
        if (userRole === "admin") {
          return <WaterMonitoringPage onNavigate={handleNavigate} />;
        }
        return <UserMonitoringPage />;

      case "feed-management":
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
