import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Package,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/layouts/Footer";

export function KebijakanPengembalianPage({ onNavigate }) {
  const policies = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Jangka Waktu",
      content:
        "Produk dapat dikembalikan dalam waktu maksimal 7 hari kalender setelah produk diterima oleh pelanggan.",
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Kondisi Produk",
      content:
        "Produk yang dikembalikan harus dalam kondisi baik, tidak rusak, belum digunakan, dan masih memiliki kemasan asli beserta label yang lengkap.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Produk yang Dapat Dikembalikan",
      content:
        "Semua produk ikan nila yang dibeli dapat dikembalikan jika tidak sesuai pesanan, rusak saat diterima, atau tidak sesuai deskripsi.",
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Produk yang Tidak Dapat Dikembalikan",
      content:
        "Produk yang sudah dikonsumsi, produk yang rusak karena kelalaian pembeli, atau produk yang sudah melewati batas waktu pengembalian.",
    },
  ];

  const returnSteps = [
    {
      step: 1,
      title: "Hubungi Customer Service",
      description:
        "Kirim email ke info@nilasense.com atau hubungi +62 812-3456-7890 dengan menyertakan nomor pesanan dan alasan pengembalian.",
    },
    {
      step: 2,
      title: "Konfirmasi dari Tim",
      description:
        "Tim kami akan memverifikasi permintaan pengembalian dalam 1x24 jam dan mengirimkan instruksi pengembalian.",
    },
    {
      step: 3,
      title: "Kirim Produk",
      description:
        "Kembalikan produk ke alamat yang telah ditentukan dengan menggunakan jasa kurir. Simpan resi pengiriman.",
    },
    {
      step: 4,
      title: "Verifikasi & Pengembalian Dana",
      description:
        "Setelah produk diterima dan diverifikasi, dana akan dikembalikan ke rekening Anda dalam 7-14 hari kerja.",
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
            <ArrowLeftRight className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Kebijakan Pengembalian
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
                Kami memahami bahwa kadang-kadang Anda mungkin perlu
                mengembalikan produk yang telah dibeli. Kebijakan ini
                menjelaskan syarat dan ketentuan untuk pengembalian produk di
                NilaSense. Kami berkomitmen untuk memastikan proses pengembalian
                berjalan lancar dan adil bagi semua pihak.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Policies */}
        <motion.div
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Ketentuan Pengembalian
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="text-primary mb-2">{policy.icon}</div>
                    <CardTitle className="text-lg">{policy.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{policy.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Return Steps */}
        <motion.div
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Proses Pengembalian
          </h2>
          <div className="space-y-6">
            {returnSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Refund Info */}
        <motion.div
          className="mb-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Informasi Pengembalian Dana
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Dana akan dikembalikan melalui metode pembayaran yang sama yang
                digunakan saat pembelian
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Waktu pengembalian dana: 7-14 hari kerja setelah produk diterima
                dan diverifikasi
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Biaya pengiriman awal tidak dapat dikembalikan, kecuali produk
                rusak atau tidak sesuai pesanan
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Biaya pengembalian produk ditanggung pembeli, kecuali produk
                rusak atau tidak sesuai pesanan
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Butuh Bantuan?
          </h2>
          <p className="text-muted-foreground mb-6">
            Jika Anda memiliki pertanyaan tentang pengembalian produk, silakan
            hubungi customer service kami
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@nilasense.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Email: info@nilasense.com
            </a>
            <a
              href="tel:+6281234567890"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Telp: +62 812-3456-7890
            </a>
          </div>
        </motion.div>
      </div>
      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}













