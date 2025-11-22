import { motion } from "framer-motion";
import {
  ShoppingCart,
  Search,
  CreditCard,
  Package,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/layouts/Footer";

export function CaraBerbelanjaPage({ onNavigate }) {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Cari Produk",
      description:
        "Gunakan fitur pencarian atau jelajahi kategori produk untuk menemukan ikan nila yang Anda butuhkan. Anda juga bisa memfilter berdasarkan kolam, lokasi, atau kategori.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Tambahkan ke Keranjang",
      description:
        "Klik pada produk untuk melihat detail lengkap, pilih jumlah yang diinginkan, lalu tambahkan ke keranjang belanja Anda.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Checkout & Bayar",
      description:
        "Tinjau pesanan Anda di keranjang, isi informasi pengiriman, lalu pilih metode pembayaran yang tersedia (Kartu Kredit, Transfer Bank, E-Wallet, atau COD).",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Terima Pesanan",
      description:
        "Setelah pembayaran dikonfirmasi, pesanan Anda akan diproses dan dikirim. Anda dapat melacak status pesanan di halaman 'Status Pesanan'.",
      color: "from-orange-500 to-red-500",
    },
  ];

  const tips = [
    "Pastikan alamat pengiriman lengkap dan benar",
    "Periksa ketersediaan stok sebelum checkout",
    "Gunakan filter untuk menemukan produk sesuai kebutuhan",
    "Baca deskripsi produk dengan teliti",
    "Simpan struk pembayaran sebagai bukti transaksi",
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
            <ShoppingCart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Cara Berbelanja di NilaSense
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Panduan lengkap untuk berbelanja ikan nila berkualitas dengan mudah
            dan aman
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br mb-4 rounded-full">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white`}
                    >
                      {step.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tips Section */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Tips Berbelanja yang Perlu Anda Ketahui
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-foreground">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Siap Berbelanja?
          </h2>
          <p className="text-muted-foreground mb-6">
            Jelajahi koleksi produk ikan nila berkualitas kami sekarang
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate("products")}
            className="bg-primary hover:bg-primary/90"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Mulai Berbelanja
          </Button>
        </motion.div>
      </div>
      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}















