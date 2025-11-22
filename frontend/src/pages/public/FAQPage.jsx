import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Footer } from "@/layouts/Footer";

export function FAQPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Akun & Registrasi",
      questions: [
        {
          q: "Bagaimana cara membuat akun di NilaSense?",
          a: "Klik tombol 'Daftar' di pojok kanan atas halaman, isi formulir dengan nama, email, dan password minimal 6 karakter. Setelah itu, Anda akan otomatis masuk ke akun baru.",
        },
        {
          q: "Apakah saya harus membuat akun untuk berbelanja?",
          a: "Ya, untuk melakukan pembelian di NilaSense, Anda perlu membuat akun terlebih dahulu. Ini membantu kami melacak pesanan dan memberikan pelayanan yang lebih baik.",
        },
        {
          q: "Bagaimana jika saya lupa password?",
          a: "Hubungi customer service kami di info@nilasense.com atau telepon +62 812-3456-7890 dengan menyertakan email terdaftar untuk proses reset password.",
        },
      ],
    },
    {
      category: "Produk & Pemesanan",
      questions: [
        {
          q: "Dari mana produk ikan nila berasal?",
          a: "Semua produk ikan nila kami berasal dari kolam budidaya yang terverifikasi dengan sistem monitoring IoT dan AI untuk menjamin kualitas dan kesegaran.",
        },
        {
          q: "Bagaimana cara memesan produk?",
          a: "Jelajahi katalog produk, klik pada produk yang diinginkan, pilih jumlah, tambahkan ke keranjang, lalu lanjutkan ke checkout untuk menyelesaikan pemesanan.",
        },
        {
          q: "Bagaimana saya tahu stok produk masih tersedia?",
          a: "Setiap produk menampilkan informasi stok yang tersedia. Jika stok habis, produk akan ditandai sebagai 'Tidak Tersedia'.",
        },
        {
          q: "Apakah saya bisa membatalkan pesanan?",
          a: "Ya, Anda dapat membatalkan pesanan melalui halaman 'Status Pesanan' sebelum pesanan dikirim. Setelah dikirim, pembatalan tidak dapat dilakukan.",
        },
      ],
    },
    {
      category: "Pembayaran",
      questions: [
        {
          q: "Metode pembayaran apa saja yang diterima?",
          a: "Kami menerima pembayaran via Kartu Kredit, Transfer Bank, E-Wallet (GoPay, OVO, Dana, dll), dan COD (Cash on Delivery) untuk area tertentu.",
        },
        {
          q: "Kapan saya harus melakukan pembayaran?",
          a: "Untuk metode transfer bank dan kartu kredit, pembayaran harus dilakukan dalam 24 jam setelah checkout. Untuk COD, pembayaran dilakukan saat produk diterima.",
        },
        {
          q: "Berapa lama proses konfirmasi pembayaran?",
          a: "Pembayaran via transfer bank biasanya terkonfirmasi dalam 1x24 jam. Pembayaran via E-Wallet dan Kartu Kredit terkonfirmasi secara instan setelah transaksi berhasil.",
        },
      ],
    },
    {
      category: "Pengiriman",
      questions: [
        {
          q: "Berapa biaya pengiriman?",
          a: "Biaya pengiriman bervariasi tergantung lokasi dan berat produk. Biaya akan dihitung otomatis saat checkout berdasarkan alamat tujuan.",
        },
        {
          q: "Berapa lama waktu pengiriman?",
          a: "Jakarta & sekitarnya: 1-2 hari kerja, Jawa: 3-5 hari kerja, Luar Jawa: 5-7 hari kerja. Waktu pengiriman dapat berubah tergantung kondisi cuaca.",
        },
        {
          q: "Apakah produk dijamin sampai dalam kondisi segar?",
          a: "Ya, kami menggunakan packaging khusus dengan pendingin untuk menjaga kesegaran produk selama pengiriman. Produk dijamin sampai dalam kondisi segar.",
        },
      ],
    },
    {
      category: "Pengembalian & Garansi",
      questions: [
        {
          q: "Bagaimana cara mengembalikan produk?",
          a: "Produk dapat dikembalikan dalam 7 hari setelah diterima jika masih dalam kondisi baik. Hubungi customer service untuk proses pengembalian.",
        },
        {
          q: "Kapan dana akan dikembalikan?",
          a: "Dana akan dikembalikan dalam 7-14 hari kerja setelah produk yang dikembalikan diterima dan diverifikasi oleh tim kami.",
        },
        {
          q: "Apakah ada garansi untuk produk?",
          a: "Kami menjamin kesegaran dan kualitas produk saat diterima. Jika produk tidak segar atau rusak, silakan hubungi customer service untuk penanganan.",
        },
      ],
    },
  ];

  const filteredFAQs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {filteredFAQs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + categoryIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const index = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openIndex === index;
                  return (
                    <Card
                      key={faqIndex}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => toggleFAQ(index)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {faq.q}
                            </h3>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.p
                                  className="text-muted-foreground"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {faq.a}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                          <div className="flex-shrink-0">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-primary" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Tidak Menemukan Jawaban?
          </h2>
          <p className="text-muted-foreground mb-6">
            Hubungi tim customer service kami untuk bantuan lebih lanjut
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@nilasense.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Hubungi Kami
            </a>
            <button
              onClick={() => onNavigate("pusat-bantuan")}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Lihat Pusat Bantuan
            </button>
          </div>
        </motion.div>
      </div>
      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}















