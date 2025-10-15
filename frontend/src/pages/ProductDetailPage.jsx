import { ArrowLeft, Phone, MapPin, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ImageWithFallback } from '../elements/ImageWithFallback';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for water quality trends
const waterQualityData = [
  { day: 'Sen', suhu: 28, ph: 7.2, oksigen: 6.5 },
  { day: 'Sel', suhu: 27, ph: 7.1, oksigen: 6.8 },
  { day: 'Rab', suhu: 28, ph: 7.3, oksigen: 6.6 },
  { day: 'Kam', suhu: 27, ph: 7.2, oksigen: 6.7 },
  { day: 'Jum', suhu: 28, ph: 7.1, oksigen: 6.9 },
  { day: 'Sab', suhu: 27, ph: 7.2, oksigen: 6.8 },
  { day: 'Min', suhu: 28, ph: 7.2, oksigen: 6.7 },
];

const productDetails = {
  1: {
    name: 'Ikan Nila Segar Premium',
    farmer: 'Tambak Jaya Abadi',
    price: 35000,
    stock: 150,
    category: 'Ikan Konsumsi',
    image: 'https://images.unsplash.com/photo-1607629194532-53c98b8180da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaHxlbnwxfHx8fDE3NjA0NTExMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    waterQuality: 'Sangat Baik',
    description: 'Ikan nila segar premium dari kolam dengan sistem monitoring IoT 24/7. Dipanen pada ukuran optimal dengan kualitas air terjaga. Cocok untuk konsumsi keluarga atau restoran.',
    location: 'Bogor, Jawa Barat',
    phone: '+62 812-3456-7890',
    lastMonitoring: {
      suhu: '28°C',
      ph: '7.2',
      oksigen: '6.7 mg/L',
      kekeruhan: '15 NTU',
    },
    feedType: 'Pelet Protein Tinggi (32%)',
  },
};

export function ProductDetailPage({ productId, onNavigate }) {
  const product = productDetails[productId] || productDetails[1];

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Halo, saya tertarik untuk memesan ${product.name} dari ${product.farmer}. Mohon informasi lebih lanjut.`
    );
    window.open(`https://wa.me/${product.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('products')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Produk
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-muted aspect-square">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#10b981] text-white">
                  {product.waterQuality}
                </Badge>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">{product.category}</Badge>
              <h1 className="text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>{product.location}</span>
              </div>
              <p className="text-muted-foreground mb-4">{product.description}</p>
            </div>

            <Separator />

            {/* Farmer Info */}
            <div>
              <h3 className="text-foreground mb-2">Informasi Petambak</h3>
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-foreground">{product.farmer}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                    Petambak Terverifikasi
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                      {product.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Harga</p>
                <p className="text-primary" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>per kg</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Stok Tersedia</p>
                <p className="text-foreground" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                  {product.stock}
                </p>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>kg</p>
              </div>
            </div>

            {/* Order Button */}
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleWhatsAppOrder}
            >
              <Phone className="w-5 h-5 mr-2" />
              Pesan via WhatsApp
            </Button>
          </div>
        </div>

        {/* Transparency Section */}
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              Transparansi Kualitas Produk
            </CardTitle>
            <p className="text-muted-foreground">
              Data monitoring real-time dari kolam asal produk
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {/* Current Water Quality */}
            <div className="mb-6">
              <h3 className="text-foreground mb-4">Data Monitoring Terakhir</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#0891b2]/10 to-[#06b6d4]/10 rounded-lg border border-[#0891b2]/20">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Suhu Air</p>
                  <p className="text-foreground" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {product.lastMonitoring.suhu}
                  </p>
                  <Badge className="mt-2 bg-[#10b981] text-white">Normal</Badge>
                </div>
                <div className="p-4 bg-gradient-to-br from-[#10b981]/10 to-[#34d399]/10 rounded-lg border border-[#10b981]/20">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>pH Air</p>
                  <p className="text-foreground" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {product.lastMonitoring.ph}
                  </p>
                  <Badge className="mt-2 bg-[#10b981] text-white">Optimal</Badge>
                </div>
                <div className="p-4 bg-gradient-to-br from-[#06b6d4]/10 to-[#0891b2]/10 rounded-lg border border-[#06b6d4]/20">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Oksigen</p>
                  <p className="text-foreground" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {product.lastMonitoring.oksigen}
                  </p>
                  <Badge className="mt-2 bg-[#10b981] text-white">Baik</Badge>
                </div>
                <div className="p-4 bg-gradient-to-br from-[#8b5cf6]/10 to-[#a78bfa]/10 rounded-lg border border-[#8b5cf6]/20">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Kekeruhan</p>
                  <p className="text-foreground" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {product.lastMonitoring.kekeruhan}
                  </p>
                  <Badge className="mt-2 bg-[#10b981] text-white">Jernih</Badge>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Water Quality Trend Chart */}
            <div>
              <h3 className="text-foreground mb-4">Tren Kualitas Air (7 Hari Terakhir)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waterQualityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="suhu"
                      stroke="#0891b2"
                      strokeWidth={2}
                      name="Suhu (°C)"
                      dot={{ fill: '#0891b2' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ph"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="pH"
                      dot={{ fill: '#10b981' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="oksigen"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="Oksigen (mg/L)"
                      dot={{ fill: '#06b6d4' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Feed Information */}
            <div>
              <h3 className="text-foreground mb-2">Manajemen Pakan</h3>
              <p className="text-muted-foreground">
                Pakan yang digunakan: <span className="text-foreground">{product.feedType}</span>
              </p>
              <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                Pemberian pakan terjadwal otomatis 3x sehari dengan kualitas pakan terjaga
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
