import { motion } from "framer-motion";
import { Fish, Target, Users, Award, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/layouts/Footer";

export function TentangKamiPage({ onNavigate }) {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Kualitas Premium",
      description:
        "Kami berkomitmen menyediakan ikan nila berkualitas tinggi dengan teknologi monitoring modern.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Kepuasan Pelanggan",
      description:
        "Pelanggan adalah prioritas utama kami. Kami selalu berusaha memberikan pelayanan terbaik.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Inovasi Teknologi",
      description:
        "Menggunakan IoT dan AI untuk memastikan kualitas produk dan efisiensi operasional.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Kolaborasi",
      description:
        "Bekerja sama dengan petambak lokal untuk mendukung ekonomi masyarakat.",
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
            <Fish className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Tentang Kami
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">
            Platform manajemen akuakultur modern yang menghubungkan petambak
            dengan konsumen untuk menyediakan ikan nila berkualitas tinggi
            dengan teknologi IoT dan AI
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          className="mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-none">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Kisah Kami
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  NilaSense lahir dari visi untuk mengubah cara budidaya ikan
                  nila di Indonesia dengan memanfaatkan teknologi modern. Kami
                  percaya bahwa teknologi IoT (Internet of Things) dan
                  Artificial Intelligence dapat meningkatkan kualitas produksi
                  dan transparansi dalam rantai pasok ikan nila.
                </p>
                <p>
                  Platform kami tidak hanya menghubungkan petambak dengan
                  konsumen, tetapi juga menyediakan sistem monitoring real-time
                  untuk kualitas air, jadwal pemberian pakan, dan manajemen
                  kolam yang lebih efisien. Dengan demikian, kami memastikan
                  bahwa setiap produk yang sampai ke tangan konsumen adalah ikan
                  nila berkualitas premium.
                </p>
                <p>
                  Komitmen kami adalah memberikan produk terbaik sambil
                  mendukung petambak lokal dan meningkatkan kesadaran masyarakat
                  tentang pentingnya budidaya ikan yang berkelanjutan.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values */}
        <motion.div
          className="mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nilai-Nilai Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-primary mb-4 flex justify-center">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tim Pengembang
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              Tim pengembang yang berdedikasi untuk menghadirkan solusi terbaik
              dalam manajemen budidaya ikan nila
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Developer 1 */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{
                y: -15,
                scale: 1.05,
                transition: { duration: 0.3, type: "spring", stiffness: 200 },
              }}
            >
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                <img
                  src="/team/ahmadfaris.jpg"
                  alt="Ahmad Faris Al Aziz"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=Ahmad+Faris&size=400&background=0891b2&color=fff";
                  }}
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-1">Ahmad Faris Al Aziz</h3>
                <p className="text-primary font-medium mb-2">J0404231081</p>
                <p className="text-muted-foreground">
                  Full Stack Developer, Data Scientist
                </p>
              </CardContent>
            </motion.div>

            {/* Developer 2 */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              whileHover={{
                y: -15,
                scale: 1.05,
                transition: { duration: 0.3, type: "spring", stiffness: 200 },
              }}
            >
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                <img
                  src="/team/bram.jpg"
                  alt="Bramantyo Wicaksono"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=Bramantyo+Wicaksono&size=400&background=0891b2&color=fff";
                  }}
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-1">Bramantyo Wicaksono</h3>
                <p className="text-primary font-medium mb-2">J0404231053</p>
                <p className="text-muted-foreground">IoT Designer</p>
              </CardContent>
            </motion.div>

            {/* Developer 3 */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              whileHover={{
                y: -15,
                scale: 1.05,
                transition: { duration: 0.3, type: "spring", stiffness: 200 },
              }}
            >
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                <img
                  src="/team/faza.jpg"
                  alt="M Faza Elrahman"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=M+Faza+Elrahman&size=400&background=0891b2&color=fff";
                  }}
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-1">M Faza Elrahman</h3>
                <p className="text-primary font-medium mb-2">J0404231155</p>
                <p className="text-muted-foreground">IoT Designer</p>
              </CardContent>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Tertarik Bekerja Sama?
          </h2>
          <p className="text-muted-foreground mb-6">
            Hubungi kami untuk informasi lebih lanjut tentang produk dan layanan
            NilaSense
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@nilasense.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Hubungi Kami
            </a>
            <button
              onClick={() => onNavigate("products")}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Lihat Produk
            </button>
          </div>
        </motion.div>
      </div>
      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
