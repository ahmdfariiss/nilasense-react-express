import { motion } from "framer-motion";
import { AlertTriangle, Info, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/layouts/Footer";

export function DisclaimerPage({ onNavigate }) {
  const disclaimers = [
    {
      icon: <Info className="w-6 h-6" />,
      title: "Informasi Produk",
      content: [
        "Kami berusaha menyediakan informasi yang akurat tentang produk, namun tidak menjamin bebas dari kesalahan atau kelalaian",
        "Gambar produk di website adalah ilustrasi dan mungkin berbeda dengan produk asli",
        "Harga produk dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya",
        "Ketersediaan stok dapat berubah setiap saat",
      ],
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Batasan Tanggung Jawab",
      content: [
        "NilaSense tidak bertanggung jawab atas kerugian langsung, tidak langsung, atau konsekuensial yang timbul dari penggunaan platform",
        "Kami tidak menjamin platform akan selalu tersedia, bebas dari gangguan, atau bebas dari virus",
        "Tanggung jawab kami terbatas pada nilai produk yang dibeli",
        "Kami tidak bertanggung jawab atas kerusakan produk yang disebabkan oleh pihak ketiga (kurir)",
      ],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Link ke Website Lain",
      content: [
        "Platform kami mungkin berisi link ke website pihak ketiga",
        "Kami tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik website pihak ketiga",
        "Pengguna disarankan untuk membaca syarat dan ketentuan website pihak ketiga sebelum menggunakan layanannya",
      ],
    },
    {
      icon: <Info className="w-6 h-6" />,
      title: "Perubahan Layanan",
      content: [
        "Kami berhak mengubah, menangguhkan, atau menghentikan bagian atau seluruh layanan tanpa pemberitahuan sebelumnya",
        "Kami tidak bertanggung jawab jika layanan tidak tersedia untuk jangka waktu tertentu",
        "Perubahan akan diumumkan melalui platform atau email jika diperlukan",
      ],
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Disclaimer
          </h1>
          <p className="text-muted-foreground text-lg">
            Terakhir diperbarui: 15 Januari 2025
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-none">
            <CardContent className="p-8">
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Disclaimer ini menjelaskan batasan tanggung jawab NilaSense
                dalam menyediakan platform dan layanan. Dengan menggunakan
                platform NilaSense, Anda menyetujui disclaimer ini.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Informasi di halaman ini dapat berubah sewaktu-waktu. Kami
                menyarankan Anda untuk membaca disclaimer ini secara berkala
                untuk mendapatkan informasi terbaru.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer Sections */}
        <div className="space-y-8">
          {disclaimers.map((disclaimer, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-primary flex-shrink-0">
                      {disclaimer.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        {disclaimer.title}
                      </h2>
                      <ul className="space-y-2">
                        {disclaimer.content.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-2"
                          >
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Pertanyaan tentang Disclaimer?
          </h2>
          <p className="text-muted-foreground mb-6">
            Jika Anda memiliki pertanyaan, silakan hubungi kami di
            <a
              href="mailto:info@nilasense.com"
              className="text-primary hover:underline ml-1"
            >
              info@nilasense.com
            </a>
          </p>
        </motion.div>
      </div>
      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
