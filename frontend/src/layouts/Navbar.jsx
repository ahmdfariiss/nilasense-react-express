import { useState } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function Navbar({
  userRole,
  userName,
  currentPage,
  onNavigate,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Halaman Utama", page: "home", roles: ["guest", "user", "admin"] },
    { name: "Produk", page: "products", roles: ["guest", "user", "admin"] },
    { name: "Monitoring Kolam", page: "monitoring", roles: ["user", "admin"] },
    { name: "Admin Dashboard", page: "admin-dashboard", roles: ["admin"] },
  ];

  const visibleLinks = navLinks.filter((link) => link.roles.includes(userRole));

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white">🐟</span>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-primary/5"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">
                      {userName || "User"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-[101]">
                  <DropdownMenuItem
                    onClick={() => onNavigate("profile")}
                    className="cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  <Button
                    variant="outline"
                    onClick={() => {
                      onNavigate("profile");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onLogout?.();
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
