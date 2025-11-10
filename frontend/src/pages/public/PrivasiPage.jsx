import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/layouts/Footer";

export function PrivasiPage({ onNavigate }) {
  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data yang Kami Kumpulkan",
      content: [
        "Informasi pribadi yang Anda berikan saat registrasi (nama, email, alamat)",
        "Data transaksi dan riwayat pembelian",
        "Informasi penggunaan platform (log aktivitas, preferensi)",
        "Data teknis (IP address, jenis browser, perangkat)",
      ],
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Cara Kami Menggunakan Data",
      content: [
        "Memproses dan mengelola pesanan Anda",
        "Memberikan pelayanan customer service",
        "Meningkatkan kualitas platform dan layanan",
        "Mengirim informasi promosi dan update produk (dengan persetujuan Anda)",
        "Memenuhi kewajiban hukum dan regulasi",
      ],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Perlindungan Data",
      content: [
        "Kami menggunakan enkripsi SSL untuk melindungi data transaksi",
        "Data disimpan di server yang aman dengan akses terbatas",
        "Password di-hash menggunakan algoritma bcrypt",
        "Perlindungan terhadap akses tidak sah, modifikasi, atau pengungkapan data",
      ],
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Hak Anda",
      content: [
        "Hak untuk mengakses data pribadi Anda",
        "Hak untuk memperbaiki data yang tidak akurat",
        "Hak untuk menghapus akun dan data pribadi",
        "Hak untuk menolak penggunaan data untuk tujuan pemasaran",
        "Hak untuk menarik persetujuan kapan saja",
      ],
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Berbagi Data dengan Pihak Ketiga",
      content: [
        "Kami tidak menjual data pribadi Anda kepada pihak ketiga",
        "Data dapat dibagikan kepada penyedia jasa yang membantu operasional (kurir, payment gateway)",
        "Data dapat diungkapkan jika diwajibkan oleh hukum",
        "Semua pihak ketiga diwajibkan menjaga kerahasiaan data",
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Kebijakan Privasi
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
              <p className="text-muted-foreground text-lg leading-relaxed">
                NilaSense menghormati privasi Anda dan berkomitmen untuk
                melindungi data pribadi yang Anda berikan kepada kami. Kebijakan
                Privasi ini menjelaskan bagaimana kami mengumpulkan,
                menggunakan, menyimpan, dan melindungi informasi pribadi Anda
                saat menggunakan platform NilaSense.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
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
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        {section.title}
                      </h2>
                      <ul className="space-y-2">
                        {section.content.map((item, itemIndex) => (
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
            Pertanyaan tentang Privasi?
          </h2>
          <p className="text-muted-foreground mb-6">
            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi kami,
            silakan hubungi kami di
            <a
              href="mailto:privacy@nilasense.com"
              className="text-primary hover:underline ml-1"
            >
              privacy@nilasense.com
            </a>
          </p>
        </motion.div>
      </div>
      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}













