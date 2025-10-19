import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/navigation/Navbar';

export default function RootLayout() {
  const location = useLocation();
  
  // Hide navbar on auth pages and admin pages
  const hideNavbar = location.pathname.startsWith('/auth') || 
                    location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background">
      {!hideNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}