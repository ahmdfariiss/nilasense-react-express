import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Layouts
import RootLayout from '@/layouts/RootLayout';
import AdminLayout from '@/components/layouts/AdminLayout';
import AuthLayout from '@/components/layouts/AuthLayout';

// Public Pages
import WelcomePage from '@/pages/WelcomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// User Pages
import UserMonitoringPage from '@/pages/user/UserMonitoringPage';
import WaterQualityPage from '@/pages/user/WaterQualityPage';
import FeedSchedulePage from '@/pages/user/FeedSchedulePage';

// Admin Pages
import AdminOverviewPage from '@/pages/admin/AdminOverviewPage';
import AdminPondManagementPage from '@/pages/admin/AdminPondManagementPage';
import AdminWaterMonitoringPage from '@/pages/admin/AdminWaterMonitoringPage';
import AdminFeedManagementPage from '@/pages/admin/AdminFeedManagementPage';
import AdminProductManagementPage from '@/pages/admin/AdminProductManagementPage';
import AdminUserManagementPage from '@/pages/admin/AdminUserManagementPage';
import AdminOrderManagementPage from '@/pages/admin/AdminOrderManagementPage';

// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();

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

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}

// Admin Route Component
function AdminRoute({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}

// User Route Component  
function UserRoute({ children }) {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public Routes
      {
        index: true,
        element: <WelcomePage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />,
      },
      
      // Auth Routes
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },
        ],
      },
      
      // User Dashboard Routes
      {
        path: 'dashboard',
        element: (
          <UserRoute>
            <UserMonitoringPage />
          </UserRoute>
        ),
      },
      {
        path: 'monitoring',
        children: [
          {
            path: 'water-quality',
            element: (
              <UserRoute>
                <WaterQualityPage />
              </UserRoute>
            ),
          },
          {
            path: 'feed-schedule',
            element: (
              <UserRoute>
                <FeedSchedulePage />
              </UserRoute>
            ),
          },
        ],
      },
      
      // Admin Routes
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <Navigate to="/admin/overview" replace />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/overview',
        element: (
          <AdminRoute>
            <AdminOverviewPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/ponds',
        element: (
          <AdminRoute>
            <AdminPondManagementPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/monitoring',
        children: [
          {
            path: 'water',
            element: (
              <AdminRoute>
                <AdminWaterMonitoringPage />
              </AdminRoute>
            ),
          },
          {
            path: 'feeds',
            element: (
              <AdminRoute>
                <AdminFeedManagementPage />
              </AdminRoute>
            ),
          },
        ],
      },
      {
        path: 'admin/products',
        element: (
          <AdminRoute>
            <AdminProductManagementPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <AdminRoute>
            <AdminUserManagementPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/orders',
        element: (
          <AdminRoute>
            <AdminOrderManagementPage />
          </AdminRoute>
        ),
      },
    ],
  },
  
  // Catch all route - 404
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
          <p className="text-muted-foreground mb-4">Halaman tidak ditemukan</p>
          <a href="/" className="text-primary hover:underline">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    ),
  },
]);

export default router;