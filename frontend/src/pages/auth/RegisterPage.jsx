import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { AuthLayout } from "../layouts/AuthLayout";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function RegisterPage({ onRegister, onNavigate }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = "Nama harus diisi";
    } else if (name.length < 3) {
      newErrors.name = "Nama minimal 3 karakter";
    }

    if (!email) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!password) {
      newErrors.password = "Password harus diisi";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Call backend register
      const result = await register(name, email, password);

      if (result.success) {
        toast.success(`Selamat datang, ${name}!`, {
          description: "Akun berhasil dibuat",
        });

        // Call parent onRegister for navigation
        onRegister(name, email, password);
      } else {
        toast.error("Registrasi Gagal", {
          description: result.error,
        });
        setErrors({ general: result.error });
      }
    } catch (error) {
      toast.error("Registrasi Gagal", {
        description: "Terjadi kesalahan, silakan coba lagi",
      });
      setErrors({ general: "Terjadi kesalahan, silakan coba lagi" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      description="Bergabunglah dengan komunitas petambak modern untuk budidaya ikan nila yang lebih baik"
      imageSrc="https://images.unsplash.com/photo-1617167152345-31bbddcd6ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMG1vZGVybnxlbnwxfHx8fDE3NjA0NTExMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive text-sm">{errors.general}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            type="text"
            placeholder="Nama lengkap Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={
              errors.name
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-destructive" style={{ fontSize: "0.875rem" }}>
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={
              errors.email
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-destructive" style={{ fontSize: "0.875rem" }}>
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={
                errors.password
                  ? "border-destructive focus-visible:ring-destructive pr-10"
                  : "pr-10"
              }
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive" style={{ fontSize: "0.875rem" }}>
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password Anda"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={
                errors.confirmPassword
                  ? "border-destructive focus-visible:ring-destructive pr-10"
                  : "pr-10"
              }
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-destructive" style={{ fontSize: "0.875rem" }}>
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Daftar Sekarang"}
        </Button>

        <div className="text-center">
          <span className="text-muted-foreground">Sudah punya akun? </span>
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="text-primary hover:underline"
            disabled={isLoading}
          >
            Masuk
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
