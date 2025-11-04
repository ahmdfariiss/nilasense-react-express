import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/layouts/AuthLayout";
import { toast } from "sonner";
import api from "@/services/api";

export function LupaPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid";
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
      // Panggil API backend untuk kirim email reset password
      const response = await api.post("/auth/forgot-password", { email });

      if (response.data.message) {
        toast.success("Email reset password telah dikirim!", {
          description: response.data.message,
        });

        setIsSubmitted(true);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi";
      toast.error("Gagal mengirim email", {
        description: errorMessage,
      });
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Cek Email Anda"
        description="Instruksi reset password telah dikirim ke email Anda"
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
              Email Terkirim!
            </h2>
            <p className="text-muted-foreground mb-4">
              Kami telah mengirimkan instruksi reset password ke:
            </p>
            <p className="text-foreground font-semibold mb-6">{email}</p>
            <p className="text-sm text-muted-foreground mb-6">
              Silakan cek inbox email Anda (dan folder spam jika tidak
              ditemukan) untuk mendapatkan link reset password. Link akan
              kadaluarsa dalam 1 jam.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
            >
              Kirim Ulang Email
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => onNavigate("login")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Login
            </Button>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Lupa Password?"
      description="Masukkan email Anda untuk mendapatkan link reset password"
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
            Jangan khawatir! Masukkan email yang terdaftar dan kami akan
            mengirimkan instruksi untuk mereset password Anda.
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
          <Label htmlFor="email">Email</Label>
          <motion.div
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
          {errors.email && (
            <motion.p
              className="text-destructive"
              style={{ fontSize: "0.875rem" }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {errors.email}
            </motion.p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Kirim Link Reset Password
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

        <motion.div
          className="pt-4 border-t border-border"
          variants={itemVariants}
        >
          <p className="text-muted-foreground text-center text-sm">
            Ingat password Anda?{" "}
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="text-primary hover:underline font-medium"
            >
              Masuk di sini
            </button>
          </p>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
