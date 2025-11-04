import {
  Droplet,
  Bell,
  ShoppingCart,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { FeatureCard } from '@/components/common/FeatureCard';
import { Footer } from '@/layouts/Footer';
import { motion } from 'framer-motion';
import { AnimatedText } from '@/components/common/AnimatedText';
import { useState, useEffect } from 'react';

export function WelcomePage({ onNavigate, userRole }) {
  const [showButtonAnimation, setShowButtonAnimation] = useState(false);

  // Aktifkan animasi button setelah delay (setelah typing selesai)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtonAnimation(true);
    }, 3000); // Mulai animasi setelah 3 detik

    return () => clearTimeout(timer);
  }, []);
  const features = [
    {
      icon: <Droplet className="w-8 h-8" />,
      title: 'Kualitas Terjamin IoT',
      description:
        'Setiap ikan dipantau kualitas airnya secara real-time dengan sensor IoT canggih untuk memastikan kondisi budidaya optimal',
      color: 'from-[#0891b2] to-[#06b6d4]',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Monitoring Berbasis AI',
      description:
        'Model AI memantau dan memprediksi kualitas ikan secara otomatis, memastikan hanya produk terbaik yang sampai ke Anda',
      color: 'from-[#8b5cf6] to-[#a78bfa]',
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'Belanja Mudah & Aman',
      description:
        'Proses pembelian yang mudah dengan berbagai metode pembayaran dan sistem keamanan terpercaya',
      color: 'from-[#10b981] to-[#34d399]',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Transparansi Data Budidaya',
      description:
        'Lihat data lengkap kualitas air dan proses budidaya untuk setiap produk yang Anda beli',
      color: 'from-[#0891b2] to-[#10b981]',
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Kesegaran Terjaga',
      description:
        'Sistem pakan otomatis dan monitoring berkelanjutan memastikan ikan selalu dalam kondisi segar dan sehat',
      color: 'from-[#f59e0b] to-[#fbbf24]',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Pengiriman Cepat',
      description:
        'Sistem logistik terintegrasi untuk memastikan produk sampai dengan cepat dan tetap segar',
      color: 'from-[#06b6d4] to-[#0891b2]',
    },
  ];

  // Animation variants - lebih variatif
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
      },
    },
  };

  // Variasi animasi untuk elemen berbeda
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1], // Custom easing untuk efek bounce yang halus
      },
    },
  };

  // Animasi badge dengan scale dan rotate
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  // Animasi title dengan slide dari kiri dan fade
  const titleVariants = {
    hidden: { opacity: 0, x: -50, y: 20 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Animasi description dengan slide dari kanan
  const descVariants = {
    hidden: { opacity: 0, x: 50, y: 20 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Animasi button dengan scale dan bounce
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 12,
      },
    },
  };

  // Animasi idle untuk button (pulse halus) - gabungkan dengan buttonVariants
  const buttonIdleVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 12,
      },
    },
    idle: {
      scale: [1, 1.04, 1],
      y: [0, -3, 0],
      boxShadow: [
        '0 10px 20px rgba(0, 0, 0, 0.2)',
        '0 15px 30px rgba(255, 255, 255, 0.3), 0 10px 20px rgba(0, 0, 0, 0.3)',
        '0 10px 20px rgba(0, 0, 0, 0.2)',
      ],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Variasi animasi untuk feature cards (slide dari berbagai arah)
  const getFeatureVariants = (index) => ({
    hidden: {
      opacity: 0,
      y: index % 2 === 0 ? 50 : -50,
      x: index % 3 === 0 ? -30 : index % 3 === 1 ? 0 : 30,
      scale: 0.8,
      rotate: index % 2 === 0 ? -5 : 5,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  });

  // Animasi fade in up untuk section headers
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  // Animasi untuk CTA dengan zoom dan fade
  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Animasi floating continuous untuk elemen tertentu
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  // Animasi pulse untuk badge dot
  const pulseAnimation = {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section
        className="relative min-h-[600px] bg-gradient-to-br from-primary via-accent to-info overflow-hidden"
        variants={heroVariants}
      >
        {/* Background Image with Animation */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <ImageWithFallback
            src="https://www.tastingtable.com/img/gallery/what-makes-nile-tilapia-unique/how-are-nile-tilapia-caught-1671812051.jpg"
            alt="Ikan Nila Berkualitas"
            className="w-full h-full object-cover"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/50 via-cyan-600/40 to-blue-600/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[600px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              variants={itemVariants}
            >
              <motion.div
                className="inline-flex items-center gap-3 bg-white backdrop-blur-xs px-6 py-3 rounded-full mb-6 shadow-lg border border-gray/20"
                variants={badgeVariants}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <motion.span
                  className="w-2 h-2 bg-[#10b981] rounded-full shadow-lg"
                  animate={pulseAnimation}
                />
                <span
                  className="text-gray-800 font-semibold"
                  style={{
                    fontSize: '0.875rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  E-Commerce Ikan Nila dengan Teknologi IoT & AI
                </span>
              </motion.div>

              <motion.div
                className="text-white mb-6 drop-shadow-2xl"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textShadow:
                    '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
                }}
                variants={titleVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <h1>
                  <AnimatedText
                    text="Marketplace Ikan Nila Premium Berbasis Teknologi IoT & AI"
                    animationType="typing"
                    delay={800}
                    speed={55}
                    idleAnimation={true}
                  />
                </h1>
              </motion.div>

              <motion.p
                className="text-white mb-8 max-w-2xl mx-auto drop-shadow-lg"
                style={{
                  fontSize: '1.25rem',
                  textShadow:
                    '0 2px 8px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)',
                  fontWeight: 500,
                }}
                variants={descVariants}
              >
                Beli ikan nila berkualitas tinggi yang dibudidayakan dengan
                teknologi IoT modern dan dipantau menggunakan Model AI untuk
                menjamin kesegaran dan kualitas terbaik
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={containerVariants}
              >
                {userRole === 'guest' ? (
                  <>
                    <motion.button
                      variants={buttonIdleVariants}
                      initial="hidden"
                      animate={showButtonAnimation ? 'idle' : 'visible'}
                      viewport={{ once: true }}
                      whileInView="visible"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-black shadow-xl font-bold border-2 border-white rounded-lg mx-10 mx-10 text-lg hover:bg-gray-50 inline-flex items-center justify-center min-w-[180px]"
                      onClick={() => onNavigate('register')}
                      style={{ willChange: 'transform' }}
                    >
                      Mulai Sekarang Gratis
                    </motion.button>
                    <motion.button
                      variants={buttonIdleVariants}
                      initial="hidden"
                      animate={showButtonAnimation ? 'idle' : 'visible'}
                      viewport={{ once: true }}
                      whileInView="visible"
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/10 text-white backdrop-blur-md shadow-xl font-bold border-2 border-white rounded-lg px-10 py-4 text-lg hover:bg-white/30 hover:border-white inline-flex items-center justify-center min-w-[180px]"
                      onClick={() => onNavigate('products')}
                      style={{ willChange: 'transform' }}
                    >
                      Lihat Produk
                    </motion.button>
                  </>
                ) : userRole === 'admin' || userRole === 'petambak' ? (
                  <>
                    <motion.button
                      variants={buttonIdleVariants}
                      initial="hidden"
                      animate={showButtonAnimation ? 'idle' : 'visible'}
                      viewport={{ once: true }}
                      whileInView="visible"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-[#0891b2] shadow-xl font-bold border-2 border-white rounded-lg px-10 py-4 text-lg hover:bg-gray-50 inline-flex items-center justify-center min-w-[180px]"
                      onClick={() => onNavigate('admin-dashboard')}
                      style={{ willChange: 'transform' }}
                    >
                      Ke Dashboard
                    </motion.button>
                    <motion.button
                      variants={buttonIdleVariants}
                      initial="hidden"
                      animate={showButtonAnimation ? 'idle' : 'visible'}
                      viewport={{ once: true }}
                      whileInView="visible"
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/10 text-white backdrop-blur-md shadow-xl font-bold border-2 border-white rounded-lg px-10 py-4 text-lg hover:bg-white/30 hover:border-white inline-flex items-center justify-center min-w-[180px]"
                      onClick={() => onNavigate('water-monitoring')}
                      style={{ willChange: 'transform' }}
                    >
                      Monitoring Air
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      variants={buttonIdleVariants}
                      initial="hidden"
                      animate={showButtonAnimation ? 'idle' : 'visible'}
                      viewport={{ once: true }}
                      whileInView="visible"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-[#0891b2] shadow-xl font-bold border-2 border-white rounded-lg px-10 py-4 text-lg hover:bg-gray-50 inline-flex items-center justify-center min-w-[180px]"
                      onClick={() => onNavigate('products')}
                      style={{ willChange: 'transform' }}
                    >
                      Jelajahi Produk
                    </motion.button>
                    <motion.button
                      variants={buttonIdleVariants}
                      initial="hidden"
                      animate={showButtonAnimation ? 'idle' : 'visible'}
                      viewport={{ once: true }}
                      whileInView="visible"
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/10 text-white backdrop-blur-md shadow-xl font-bold border-2 border-white rounded-lg px-10 py-4 text-lg hover:bg-white/30 hover:border-white inline-flex items-center justify-center min-w-[180px]"
                      onClick={() => onNavigate('cart')}
                      style={{ willChange: 'transform' }}
                    >
                      Keranjang Belanja
                    </motion.button>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4"
              variants={badgeVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="text-primary" style={{ fontSize: '0.875rem' }}>
                Keunggulan Produk
              </span>
            </motion.div>
            <motion.h2
              className="text-foreground mb-4"
              variants={titleVariants}
              whileHover={{ scale: 1.02 }}
            >
              Kualitas Premium dengan Teknologi Modern
            </motion.h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto"
              style={{ fontSize: '1.125rem' }}
              variants={descVariants}
            >
              Setiap produk kami dibudidayakan dengan teknologi IoT dan dipantau
              oleh AI untuk memastikan kualitas terbaik sampai ke tangan Anda
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={getFeatureVariants(index)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{
                  scale: 1.08,
                  y: -15,
                  rotate: index % 2 === 0 ? 3 : -3,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  transition: { duration: 0.3, type: 'spring', stiffness: 300 },
                }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={containerVariants}
        >
          <motion.h2
            className="text-foreground mb-4"
            variants={ctaVariants}
            whileHover={{ scale: 1.05 }}
          >
            Siap Menikmati Ikan Nila Berkualitas Premium?
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-8 max-w-2xl mx-auto"
            style={{ fontSize: '1.125rem' }}
            variants={ctaVariants}
          >
            Bergabunglah dengan ribuan pelanggan yang sudah merasakan kualitas
            produk kami yang dibudidayakan dengan teknologi IoT dan AI
          </motion.p>
          {userRole === 'guest' ? (
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={containerVariants}
            >
              <motion.div variants={buttonVariants}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => onNavigate('register')}
                >
                  Daftar Gratis Sekarang
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('login')}
                >
                  Sudah Punya Akun? Masuk
                </Button>
              </motion.div>
            </motion.div>
          ) : userRole === 'admin' || userRole === 'petambak' ? (
            <motion.div variants={buttonVariants}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => onNavigate('admin-dashboard')}
              >
                Kelola Dashboard Anda
              </Button>
            </motion.div>
          ) : (
            <motion.div variants={buttonVariants}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => onNavigate('products')}
              >
                Mulai Belanja Sekarang
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.section>

      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
