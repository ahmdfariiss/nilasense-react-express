import {
  Droplet,
  Bell,
  ShoppingCart,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { FeatureCard } from "../components/common/FeatureCard";

export function WelcomePage({ onNavigate, userRole }) {
  const features = [
    {
      icon: <Droplet className="w-8 h-8" />,
      title: "Monitoring Real-time",
      description:
        "Pantau kualitas air (suhu, pH, oksigen, kekeruhan) secara real-time dengan sensor IoT canggih",
      color: "from-[#0891b2] to-[#06b6d4]",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Pakan Otomatis & Terjadwal",
      description:
        "Atur jadwal pemberian pakan otomatis dan dapatkan notifikasi untuk manajemen yang lebih efisien",
      color: "from-[#f59e0b] to-[#fbbf24]",
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Marketplace Transparan",
      description:
        "Jual ikan nila dengan data kualitas yang transparan untuk meningkatkan kepercayaan pembeli",
      color: "from-[#10b981] to-[#34d399]",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Prediksi AI",
      description:
        "Dapatkan prediksi kualitas air berbasis AI untuk mencegah masalah sebelum terjadi",
      color: "from-[#8b5cf6] to-[#a78bfa]",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Data Aman & Terpercaya",
      description:
        "Semua data monitoring tersimpan aman dan dapat diakses kapan saja sebagai bukti kualitas",
      color: "from-[#0891b2] to-[#10b981]",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Mudah Digunakan",
      description:
        "Interface yang intuitif dan mudah digunakan, bahkan untuk petambak tradisional",
      color: "from-[#06b6d4] to-[#0891b2]",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-accent to-info overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1731552467185-aadc0dc27c7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmR8ZW58MXx8fHwxNzYwNDUxMTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Fish Farm Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
              <span className="text-white" style={{ fontSize: "0.875rem" }}>
                Platform Manajemen Akuakultur Modern
              </span>
            </div>

            <h1
              className="text-white mb-6"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Manajemen Budidaya Ikan Nila Modern dengan Teknologi IoT
            </h1>

            <p
              className="text-white/90 mb-8 max-w-2xl mx-auto"
              style={{ fontSize: "1.25rem" }}
            >
              Tingkatkan produktivitas dan kualitas budidaya ikan nila Anda
              dengan monitoring real-time, pakan otomatis, dan marketplace yang
              transparan
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {userRole === "guest" ? (
                <>
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90"
                    onClick={() => onNavigate("register")}
                  >
                    Mulai Sekarang Gratis
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-primary hover:bg-white/90"
                    onClick={() => onNavigate("products")}
                  >
                    Lihat Produk
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90"
                    onClick={() =>
                      onNavigate(
                        userRole === "admin" ? "admin-dashboard" : "products"
                      )
                    }
                  >
                    {userRole === "admin" ? "Ke Dashboard" : "Jelajahi Produk"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => onNavigate("monitoring")}
                  >
                    Monitoring Air
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <span className="text-primary" style={{ fontSize: "0.875rem" }}>
                Fitur Unggulan
              </span>
            </div>
            <h2 className="text-foreground mb-4">
              Solusi Lengkap untuk Budidaya Modern
            </h2>
            <p
              className="text-muted-foreground max-w-2xl mx-auto"
              style={{ fontSize: "1.125rem" }}
            >
              NilaSense menyediakan semua yang Anda butuhkan untuk mengelola
              budidaya ikan nila dengan teknologi terkini
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div
                className="text-primary mb-2"
                style={{ fontSize: "3rem", fontWeight: 700 }}
              >
                500+
              </div>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "1.125rem" }}
              >
                Petambak Terdaftar
              </p>
            </div>
            <div className="text-center">
              <div
                className="text-primary mb-2"
                style={{ fontSize: "3rem", fontWeight: 700 }}
              >
                1M+
              </div>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "1.125rem" }}
              >
                Data Monitoring Tercatat
              </p>
            </div>
            <div className="text-center">
              <div
                className="text-primary mb-2"
                style={{ fontSize: "3rem", fontWeight: 700 }}
              >
                95%
              </div>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "1.125rem" }}
              >
                Kepuasan Pengguna
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-foreground mb-4">
            Siap Meningkatkan Budidaya Ikan Nila Anda?
          </h2>
          <p
            className="text-muted-foreground mb-8 max-w-2xl mx-auto"
            style={{ fontSize: "1.125rem" }}
          >
            Bergabunglah dengan ratusan petambak yang sudah merasakan manfaat
            teknologi NilaSense
          </p>
          {userRole === "guest" ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => onNavigate("register")}
              >
                Daftar Gratis Sekarang
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("login")}
              >
                Sudah Punya Akun? Masuk
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={() =>
                onNavigate(
                  userRole === "admin" ? "admin-dashboard" : "products"
                )
              }
            >
              {userRole === "admin"
                ? "Kelola Dashboard Anda"
                : "Mulai Jelajahi"}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
