import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  MessageCircle,
  BookOpen,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/layouts/Footer";

export function PusatBantuanPage({ onNavigate }) {
  const faqCategories = [
    {
      title: "Akun & Profil",
      icon: <HelpCircle className="w-5 h-5" />,
      faqs: [
        {
          question: "Bagaimana cara membuat akun?",
          answer:
            "Klik tombol 'Daftar' di pojok kanan atas, isi formulir dengan email, nama, dan password minimal 6 karakter, lalu klik 'Daftar Sekarang'.",
        },
        {
          question: "Lupa password, bagaimana caranya?",
          answer:
            "Hubungi kami di info@nilasense.com atau telepon +62 812-3456-7890 untuk reset password.",
        },
        {
          question: "Bagaimana cara mengubah profil saya?",
          answer:
            "Login ke akun Anda, kemudian akses menu Profil untuk mengubah informasi pribadi.",
        },
      ],
    },
    {
      title: "Pemesanan & Pembayaran",
      icon: <MessageCircle className="w-5 h-5" />,
      faqs: [
        {
          question: "Metode pembayaran apa saja yang tersedia?",
          answer:
            "Kami menerima pembayaran via Kartu Kredit, Transfer Bank, E-Wallet, dan COD (Cash on Delivery).",
        },
        {
          question: "Berapa lama proses pembayaran dikonfirmasi?",
          answer:
            "Pembayaran via transfer bank biasanya terkonfirmasi dalam 1x24 jam. Pembayaran via E-Wallet dan Kartu Kredit terkonfirmasi secara instan.",
        },
        {
          question: "Bagaimana cara membatalkan pesanan?",
          answer:
            "Anda dapat membatalkan pesanan melalui halaman Status Pesanan sebelum pesanan dikirim.",
        },
      ],
    },
    {
      title: "Pengiriman & Pengembalian",
      icon: <BookOpen className="w-5 h-5" />,
      faqs: [
        {
          question: "Berapa biaya pengiriman?",
          answer:
            "Biaya pengiriman bervariasi tergantung lokasi dan berat produk. Biaya akan dihitung otomatis saat checkout.",
        },
        {
          question: "Berapa lama waktu pengiriman?",
          answer:
            "Pengiriman dalam kota Jakarta: 1-2 hari. Luar kota: 3-5 hari kerja. Luar pulau: 5-7 hari kerja.",
        },
        {
          question: "Bagaimana cara mengembalikan produk?",
          answer:
            "Produk dapat dikembalikan dalam 7 hari setelah diterima jika masih dalam kondisi baik. Hubungi customer service untuk proses pengembalian.",
        },
      ],
    },
  ];

  const helpSections = [
    {
      title: "Cara Berbelanja",
      description: "Pelajari langkah-langkah berbelanja di NilaSense",
      action: () => onNavigate("cara-berbelanja"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Pengiriman & Pengembalian",
      description:
        "Informasi lengkap tentang pengiriman dan kebijakan pengembalian",
      action: () => onNavigate("pengiriman-pengembalian"),
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Hubungi Kami",
      description: "Butuh bantuan lebih lanjut? Tim kami siap membantu",
      action: () => {},
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Pusat Bantuan
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan Anda atau hubungi tim support kami
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari bantuan, pertanyaan, atau topik..."
              className="pl-12 h-14 text-lg"
            />
          </div>
        </motion.div>

        {/* Quick Help Sections */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {helpSections.map((section, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className="cursor-pointer h-full hover:shadow-lg transition-shadow"
                onClick={section.action}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground">{section.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + categoryIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                {category.icon}
                <h2 className="text-2xl font-bold text-foreground">
                  {category.title}
                </h2>
              </div>
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => (
                  <Card
                    key={faqIndex}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Masih Perlu Bantuan?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Tim customer service kami siap membantu Anda 24/7. Hubungi kami
            melalui email atau telepon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = "mailto:info@nilasense.com")
              }
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Email: info@nilasense.com
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "tel:+6281234567890")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Telp: +62 812-3456-7890
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}













