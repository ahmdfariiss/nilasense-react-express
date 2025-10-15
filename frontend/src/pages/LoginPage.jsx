import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { AuthLayout } from '../layouts/AuthLayout';

export function LoginPage({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Demo: admin@nilasense.com logs in as admin, others as user
      const role = email === 'admin@nilasense.com' ? 'admin' : 'user';
      onLogin(email, password, role);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      description="Manajemen Budidaya Ikan Nila Modern dengan Monitoring Real-time"
      imageSrc="https://images.unsplash.com/photo-1731552467185-aadc0dc27c7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmR8ZW58MXx8fHwxNzYwNDUxMTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.email && (
            <p className="text-destructive" style={{ fontSize: '0.875rem' }}>{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive" style={{ fontSize: '0.875rem' }}>{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked)}
            />
            <Label htmlFor="remember" className="cursor-pointer" style={{ fontWeight: 400 }}>
              Ingat Saya
            </Label>
          </div>
          <button
            type="button"
            className="text-primary hover:underline"
            style={{ fontSize: '0.875rem' }}
          >
            Lupa Password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? 'Memproses...' : 'Masuk'}
        </Button>

        <div className="text-center">
          <span className="text-muted-foreground">Belum punya akun? </span>
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="text-primary hover:underline"
          >
            Daftar Sekarang
          </button>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-muted-foreground text-center" style={{ fontSize: '0.875rem' }}>
            Demo: Gunakan <span className="text-primary">admin@nilasense.com</span> untuk login sebagai admin
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
