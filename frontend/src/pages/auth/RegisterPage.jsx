import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function RegisterPage({ onRegister, onNavigate }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = 'Nama harus diisi';
    } else if (name.length < 3) {
      newErrors.name = 'Nama minimal 3 karakter';
    }

    if (!email) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!password) {
      newErrors.password = 'Password harus diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
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
          description: 'Akun berhasil dibuat',
        });

        // Call parent onRegister for navigation
        onRegister(name, email, password);
      } else {
        toast.error('Registrasi Gagal', {
          description: result.error,
        });
        setErrors({ general: result.error });
      }
    } catch (error) {
      toast.error('Registrasi Gagal', {
        description: 'Terjadi kesalahan, silakan coba lagi',
      });
      setErrors({ general: 'Terjadi kesalahan, silakan coba lagi' });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
        ease: 'easeOut',
      },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, x: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      description="Bergabunglah ke Marketplace Ikan Nila Premium Berbasis Teknologi IoT & AI"
      imageSrc="https://images.unsplash.com/photo-1535591273668-578e31182c4f?q=80&w=2070&auto=format&fit=crop"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {errors.general && (
            <motion.div
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="text-destructive text-sm">{errors.general}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="name">Nama Lengkap</Label>
          <motion.div
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              id="name"
              type="text"
              placeholder="Nama lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={
                errors.name
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
              disabled={isLoading}
            />
          </motion.div>
          <AnimatePresence>
            {errors.name && (
              <motion.p
                className="text-destructive"
                style={{ fontSize: '0.875rem' }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {errors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

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
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
              disabled={isLoading}
            />
          </motion.div>
          <AnimatePresence>
            {errors.email && (
              <motion.p
                className="text-destructive"
                style={{ fontSize: '0.875rem' }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="password">Password</Label>
          <motion.div
            className="relative"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={
                errors.password
                  ? 'border-destructive focus-visible:ring-destructive pr-10'
                  : 'pr-10'
              }
              disabled={isLoading}
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {showPassword ? (
                  <motion.div
                    key="eye-off"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EyeOff className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="eye"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Eye className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
          <AnimatePresence>
            {errors.password && (
              <motion.p
                className="text-destructive"
                style={{ fontSize: '0.875rem' }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {errors.password}
              </motion.p>
            )}
          </AnimatePresence>
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
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Ulangi password Anda"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={
                errors.confirmPassword
                  ? 'border-destructive focus-visible:ring-destructive pr-10'
                  : 'pr-10'
              }
              disabled={isLoading}
            />
            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {showConfirmPassword ? (
                  <motion.div
                    key="eye-off"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EyeOff className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="eye"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Eye className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.p
                className="text-destructive"
                style={{ fontSize: '0.875rem' }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Memproses...
                </motion.span>
              ) : (
                'Daftar Sekarang'
              )}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div className="text-center" variants={itemVariants}>
          <span className="text-muted-foreground">Sudah punya akun? </span>
          <motion.button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-primary hover:underline"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Masuk
          </motion.button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
