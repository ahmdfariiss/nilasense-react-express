import {
  Droplet,
  Bell,
  ShoppingCart,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { FeatureCard } from "@/components/common/FeatureCard";
import { Footer } from "@/layouts/Footer";

export function WelcomePage({ onNavigate, userRole }) {
  const features = [
    {
      icon: <Droplet className="w-8 h-8" />,
      title: "Kualitas Terjamin IoT",
      description:
        "Setiap ikan dipantau kualitas airnya secara real-time dengan sensor IoT canggih untuk memastikan kondisi budidaya optimal",
      color: "from-[#0891b2] to-[#06b6d4]",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Monitoring Berbasis AI",
      description:
        "Model AI memantau dan memprediksi kualitas ikan secara otomatis, memastikan hanya produk terbaik yang sampai ke Anda",
      color: "from-[#8b5cf6] to-[#a78bfa]",
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Belanja Mudah & Aman",
      description:
        "Proses pembelian yang mudah dengan berbagai metode pembayaran dan sistem keamanan terpercaya",
      color: "from-[#10b981] to-[#34d399]",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Transparansi Data Budidaya",
      description:
        "Lihat data lengkap kualitas air dan proses budidaya untuk setiap produk yang Anda beli",
      color: "from-[#0891b2] to-[#10b981]",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Kesegaran Terjaga",
      description:
        "Sistem pakan otomatis dan monitoring berkelanjutan memastikan ikan selalu dalam kondisi segar dan sehat",
      color: "from-[#f59e0b] to-[#fbbf24]",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Pengiriman Cepat",
      description:
        "Sistem logistik terintegrasi untuk memastikan produk sampai dengan cepat dan tetap segar",
      color: "from-[#06b6d4] to-[#0891b2]",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[600px] bg-gradient-to-br from-primary via-accent to-info overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://plus.unsplash.com/premium_photo-1664297954507-186bbacccd73?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
            alt="Ikan Nila Berkualitas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-cyan-600/40 to-blue-600/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[600px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 bg-white/30 backdrop-blur-md px-6 py-3 rounded-full mb-6 shadow-lg border border-white/20">
                <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-lg" />
                <span
                  className="text-white font-semibold"
                  style={{
                    fontSize: "0.875rem",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  E-Commerce Ikan Nila dengan Teknologi IoT & AI
                </span>
              </div>

              <h1
                className="text-white mb-6 drop-shadow-2xl"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textShadow:
                    "0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Marketplace Ikan Nila Premium Berbasis Teknologi IoT & AI
              </h1>

              <p
                className="text-white mb-8 max-w-2xl mx-auto drop-shadow-lg"
                style={{
                  fontSize: "1.25rem",
                  textShadow:
                    "0 2px 8px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)",
                  fontWeight: 500,
                }}
              >
                Beli ikan nila berkualitas tinggi yang dibudidayakan dengan
                teknologi IoT modern dan dipantau menggunakan Model AI untuk
                menjamin kesegaran dan kualitas terbaik
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {userRole === "guest" ? (
                  <>
                    <Button
                      size="lg"
                      className="bg-white text-[#0891b2] shadow-xl font-bold border-2 border-white transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:bg-gray-50"
                      onClick={() => onNavigate("register")}
                      style={{ willChange: "transform" }}
                    >
                      Mulai Sekarang Gratis
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white/10 text-white backdrop-blur-md shadow-xl font-bold border-2 border-white transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:bg-white/30 hover:border-white"
                      onClick={() => onNavigate("products")}
                      style={{ willChange: "transform" }}
                    >
                      Lihat Produk
                    </Button>
                  </>
                ) : userRole === "admin" || userRole === "petambak" ? (
                  <>
                    <Button
                      size="lg"
                      className="bg-white text-[#0891b2] shadow-xl font-bold border-2 border-white transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:bg-gray-50"
                      onClick={() => onNavigate("admin-dashboard")}
                      style={{ willChange: "transform" }}
                    >
                      Ke Dashboard
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white/10 text-white backdrop-blur-md shadow-xl font-bold border-2 border-white transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:bg-white/30 hover:border-white"
                      onClick={() => onNavigate("water-monitoring")}
                      style={{ willChange: "transform" }}
                    >
                      Monitoring Air
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="bg-white text-[#0891b2] shadow-xl font-bold border-2 border-white transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:bg-gray-50"
                      onClick={() => onNavigate("products")}
                      style={{ willChange: "transform" }}
                    >
                      Jelajahi Produk
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white/10 text-white backdrop-blur-md shadow-xl font-bold border-2 border-white transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:bg-white/30 hover:border-white"
                      onClick={() => onNavigate("cart")}
                      style={{ willChange: "transform" }}
                    >
                      Keranjang Belanja
                    </Button>
                  </>
                )}
              </div>
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
                Keunggulan Produk
              </span>
            </div>
            <h2 className="text-foreground mb-4">
              Kualitas Premium dengan Teknologi Modern
            </h2>
            <p
              className="text-muted-foreground max-w-2xl mx-auto"
              style={{ fontSize: "1.125rem" }}
            >
              Setiap produk kami dibudidayakan dengan teknologi IoT dan dipantau
              oleh AI untuk memastikan kualitas terbaik sampai ke tangan Anda
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

      {/* Developer Team Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <span className="text-primary" style={{ fontSize: "0.875rem" }}>
                Tim Pengembang
              </span>
            </div>
            <h2 className="text-foreground mb-4">Meet Our Team</h2>
            <p
              className="text-muted-foreground max-w-2xl mx-auto"
              style={{ fontSize: "1.125rem" }}
            >
              Tim pengembang yang berdedikasi untuk menghadirkan solusi terbaik
              dalam manajemen budidaya ikan nila
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Developer 1 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                <img
                  src="/team/ahmadfaris.jpg"
                  alt="Ahmad Faris Al Aziz"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=Developer+1&size=400&background=0891b2&color=fff&bold=true";
                  }}
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Ahmad Faris AL Aziz
                </h3>
                <p className="text-primary font-semibold mb-2">J0404231081</p>
                <p className="text-muted-foreground">Full Stack Developer</p>
              </div>
            </div>

            {/* Developer 2 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                <img
                  src="/team/bram.jpg"
                  alt="Bramantyo Wicaksono"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=Developer+2&size=400&background=10b981&color=fff&bold=true";
                  }}
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Bramantyo Wicaksono
                </h3>
                <p className="text-primary font-semibold mb-2">J0404231053</p>
                <p className="text-muted-foreground">IOT Designer</p>
              </div>
            </div>

            {/* Developer 3 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                <img
                  src="/team/faza.jpg"
                  alt="M Faza Elrahman"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=Developer+3&size=400&background=8b5cf6&color=fff&bold=true";
                  }}
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  M Faza Elrahman
                </h3>
                <p className="text-primary font-semibold mb-2">J0404231155</p>
                <p className="text-muted-foreground">Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-foreground mb-4">
            Siap Menikmati Ikan Nila Berkualitas Premium?
          </h2>
          <p
            className="text-muted-foreground mb-8 max-w-2xl mx-auto"
            style={{ fontSize: "1.125rem" }}
          >
            Bergabunglah dengan ribuan pelanggan yang sudah merasakan kualitas
            produk kami yang dibudidayakan dengan teknologi IoT dan AI
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
          ) : userRole === "admin" || userRole === "petambak" ? (
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={() => onNavigate("admin-dashboard")}
            >
              Kelola Dashboard Anda
            </Button>
          ) : (
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={() => onNavigate("products")}
            >
              Mulai Belanja Sekarang
            </Button>
          )}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
