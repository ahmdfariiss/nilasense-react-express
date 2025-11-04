import { motion } from "framer-motion";
import { FileText, CheckCircle, AlertTriangle, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/layouts/Footer";

export function SyaratKetentuanPage({ onNavigate }) {
  const terms = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Penggunaan Platform",
      items: [
        "Anda harus berusia minimal 18 tahun atau telah mendapat persetujuan dari orang tua/wali",
        "Anda bertanggung jawab untuk menjaga kerahasiaan akun dan password",
        "Dilarang menggunakan platform untuk tujuan ilegal atau melanggar hukum",
        "Kami berhak menangguhkan atau menutup akun yang melanggar ketentuan",
      ],
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Pemesanan dan Pembayaran",
      items: [
        "Pesanan dianggap valid setelah pembayaran dikonfirmasi",
        "Harga produk dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya",
        "Kami berhak menolak atau membatalkan pesanan jika terjadi kesalahan harga atau stok habis",
        "Pembayaran harus dilakukan sesuai dengan waktu yang ditentukan",
      ],
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Pembatalan dan Pengembalian",
      items: [
        "Pembatalan pesanan dapat dilakukan sebelum produk dikirim",
        "Pengembalian produk mengikuti kebijakan pengembalian yang berlaku",
        "Produk yang dikembalikan harus dalam kondisi baik dan sesuai syarat",
        "Biaya pengembalian ditanggung sesuai ketentuan yang berlaku",
      ],
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Hak Kekayaan Intelektual",
      items: [
        "Semua konten di platform NilaSense dilindungi hak cipta",
        "Pengguna dilarang menyalin, memodifikasi, atau menggunakan konten tanpa izin",
        "Logo dan merek NilaSense adalah hak milik kami",
        "Pelanggaran hak kekayaan intelektual dapat dikenakan sanksi hukum",
      ],
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Batasan Tanggung Jawab",
      items: [
        "Kami tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan platform",
        "Kami berusaha menyediakan informasi yang akurat namun tidak menjamin bebas dari kesalahan",
        "Tanggung jawab kami terbatas pada nilai produk yang dibeli",
        "Kami tidak bertanggung jawab atas masalah yang disebabkan oleh pihak ketiga (kurir, payment gateway)",
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
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Syarat & Ketentuan
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
                Dengan mengakses dan menggunakan platform NilaSense, Anda
                dianggap telah membaca, memahami, dan menyetujui Syarat &
                Ketentuan yang berlaku. Jika Anda tidak setuju dengan ketentuan
                ini, mohon untuk tidak menggunakan platform kami.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Kami berhak mengubah Syarat & Ketentuan ini sewaktu-waktu.
                Perubahan akan diberitahukan melalui platform dan berlaku
                efektif setelah dipublikasikan.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {terms.map((term, index) => (
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
                      {term.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        {term.title}
                      </h2>
                      <ul className="space-y-2">
                        {term.items.map((item, itemIndex) => (
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
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Pertanyaan tentang Syarat & Ketentuan?
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

