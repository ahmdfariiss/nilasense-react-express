import { motion } from "framer-motion";
import { Truck, ArrowLeftRight, Clock, MapPin, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/layouts/Footer";

export function PengirimanPengembalianPage({ onNavigate }) {
  const shippingInfo = [
    {
      title: "Jakarta & Sekitarnya",
      duration: "1-2 hari kerja",
      cost: "Rp 15.000 - Rp 25.000",
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      title: "Jawa",
      duration: "3-5 hari kerja",
      cost: "Rp 25.000 - Rp 40.000",
      icon: <Truck className="w-6 h-6" />,
    },
    {
      title: "Sumatera, Bali, Kalimantan",
      duration: "5-7 hari kerja",
      cost: "Rp 40.000 - Rp 60.000",
      icon: <Package className="w-6 h-6" />,
    },
    {
      title: "Luar Pulau",
      duration: "7-10 hari kerja",
      cost: "Rp 60.000 - Rp 100.000",
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  const returnPolicy = [
    {
      title: "Syarat Pengembalian",
      items: [
        "Produk dikembalikan dalam waktu maksimal 7 hari setelah diterima",
        "Produk masih dalam kondisi baik, tidak rusak, dan belum digunakan",
        "Produk masih memiliki kemasan asli dan label yang lengkap",
        "Menyertakan bukti pembayaran atau invoice",
      ],
    },
    {
      title: "Proses Pengembalian",
      items: [
        "Hubungi customer service melalui email atau telepon",
        "Sertakan foto produk dan alasan pengembalian",
        "Tim kami akan mengkonfirmasi dalam 1x24 jam",
        "Jika disetujui, produk dapat dikembalikan melalui jasa kurir",
        "Dana akan dikembalikan dalam 7-14 hari kerja setelah produk diterima",
      ],
    },
    {
      title: "Biaya Pengembalian",
      items: [
        "Biaya pengembalian ditanggung pembeli, kecuali produk rusak/berbeda",
        "Jika produk rusak atau tidak sesuai, biaya ditanggung NilaSense",
        "Biaya pengiriman awal tidak dapat dikembalikan",
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Truck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Pengiriman & Pengembalian
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Informasi lengkap tentang layanan pengiriman dan kebijakan
            pengembalian produk
          </p>
        </motion.div>

        {/* Pengiriman Section */}
        <motion.div
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Truck className="w-8 h-8 text-primary" />
            Informasi Pengiriman
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-primary mb-2">{info.icon}</div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Waktu:
                        </span>
                        <p className="font-semibold">{info.duration}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Biaya:
                        </span>
                        <p className="font-semibold">{info.cost}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-6 bg-primary/5 rounded-lg">
            <p className="text-muted-foreground">
              <strong>Catatan:</strong> Biaya pengiriman akan dihitung otomatis
              saat checkout berdasarkan alamat dan berat produk. Estimasi waktu
              pengiriman dapat berubah tergantung kondisi cuaca dan kebijakan
              jasa kurir.
            </p>
          </div>
        </motion.div>

        {/* Pengembalian Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8 text-primary" />
            Kebijakan Pengembalian
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {returnPolicy.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl">{policy.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {policy.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Butuh Bantuan Lebih Lanjut?
          </h2>
          <p className="text-muted-foreground mb-6">
            Jika Anda memiliki pertanyaan tentang pengiriman atau pengembalian,
            jangan ragu untuk menghubungi tim customer service kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@nilasense.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Email Kami
            </a>
            <a
              href="tel:+6281234567890"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Hubungi via Telepon
            </a>
          </div>
        </motion.div>
      </div>
      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}















