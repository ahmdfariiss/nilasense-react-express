import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/layouts/AuthLayout";
import { toast } from "sonner";
import api from "@/services/api";

export function ResetPasswordPage({ onNavigate }) {
  // Get token from URL query parameter
  const getTokenFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  };

  const [token] = useState(() => getTokenFromURL());
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      toast.error("Token tidak valid", {
        description: "Link reset password tidak valid atau sudah kadaluarsa",
      });
      onNavigate("lupa-password");
    }
  }, [token, onNavigate]);

  const validate = () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = "Password baru harus diisi";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password minimal 6 karakter";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (newPassword !== confirmPassword) {
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
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      if (response.data.message) {
        toast.success("Password berhasil direset!", {
          description: response.data.message,
        });

        setIsSuccess(true);

        // Redirect ke login setelah 3 detik
        setTimeout(() => {
          onNavigate("login");
        }, 3000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi";
      toast.error("Gagal reset password", {
        description: errorMessage,
      });
      setErrors({ general: errorMessage });

      // Jika token tidak valid, redirect ke lupa password
      if (error.response?.status === 400) {
        setTimeout(() => {
          onNavigate("lupa-password");
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null; // Will redirect
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password Berhasil Direset"
        description="Password Anda telah berhasil direset"
        imageSrc="https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=2070&auto=format&fit=crop"
      >
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Password Berhasil Direset!
            </h2>
            <p className="text-muted-foreground mb-6">
              Password Anda telah berhasil direset. Silakan login dengan
              password baru Anda.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Anda akan diarahkan ke halaman login dalam beberapa detik...
            </p>
          </div>

          <Button className="w-full" onClick={() => onNavigate("login")}>
            Masuk Sekarang
          </Button>
        </motion.div>
      </AuthLayout>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <AuthLayout
      title="Reset Password"
      description="Masukkan password baru untuk akun Anda"
      imageSrc="https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=2070&auto=format&fit=crop"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <p className="text-muted-foreground text-sm mb-6">
            Masukkan password baru yang akan Anda gunakan untuk login.
          </p>
        </motion.div>

        {errors.general && (
          <motion.div
            className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-destructive text-sm">{errors.general}</p>
            </div>
          </motion.div>
        )}

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="newPassword">Password Baru</Label>
          <motion.div
            className="relative"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 6 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={
                errors.newPassword
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
          </motion.div>
          {errors.newPassword && (
            <motion.p
              className="text-destructive"
              style={{ fontSize: "0.875rem" }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.newPassword}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <motion.div
            className="relative"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password baru"
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
          </motion.div>
          {errors.confirmPassword && (
            <motion.p
              className="text-destructive"
              style={{ fontSize: "0.875rem" }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {errors.confirmPassword}
            </motion.p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading || !token}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Mereset Password...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center pt-4 border-t border-border"
          variants={itemVariants}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => onNavigate("login")}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Login
          </Button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
