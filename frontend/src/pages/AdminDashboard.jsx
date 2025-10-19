import {
  LayoutDashboard,
  Droplet,
  UtensilsCrossed,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for charts
const waterQualityTrend = [
  { time: "00:00", suhu: 27, ph: 7.1 },
  { time: "04:00", suhu: 26, ph: 7.2 },
  { time: "08:00", suhu: 28, ph: 7.2 },
  { time: "12:00", suhu: 29, ph: 7.1 },
  { time: "16:00", suhu: 28, ph: 7.2 },
  { time: "20:00", suhu: 27, ph: 7.3 },
  { time: "23:59", suhu: 27, ph: 7.2 },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Restoran Seafood Jaya",
    product: "Nila Premium",
    qty: "50 kg",
    status: "Menunggu",
  },
  {
    id: "ORD-002",
    customer: "Pasar Ikan Modern",
    product: "Nila Merah",
    qty: "100 kg",
    status: "Diproses",
  },
  {
    id: "ORD-003",
    customer: "Toko Ikan Segar",
    product: "Bibit Nila",
    qty: "500 ekor",
    status: "Selesai",
  },
  {
    id: "ORD-004",
    customer: "Bu Ani",
    product: "Nila Fillet",
    qty: "10 kg",
    status: "Menunggu",
  },
  {
    id: "ORD-005",
    customer: "Warung Makan Berkah",
    product: "Nila Premium",
    qty: "25 kg",
    status: "Diproses",
  },
];

const aiPredictions = [
  {
    parameter: "Oksigen Terlarut",
    prediction: "Diperkirakan Stabil",
    status: "good",
    trend: "stable",
  },
  {
    parameter: "pH Air",
    prediction: "Potensi Naik Sedikit",
    status: "warning",
    trend: "up",
  },
  {
    parameter: "Suhu Air",
    prediction: "Tetap Normal",
    status: "good",
    trend: "stable",
  },
  {
    parameter: "Kekeruhan",
    prediction: "Kemungkinan Meningkat",
    status: "warning",
    trend: "up",
  },
];

// 1. Interface AdminDashboardProps dihapus
// 2. Type annotation pada { onNavigate } dihapus
export function AdminDashboard({ onNavigate }) {
  const sidebarItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      active: true,
      page: "admin-dashboard",
    },
    {
      icon: <Droplet className="w-5 h-5" />,
      label: "Monitoring Air",
      active: false,
      page: "water-monitoring",
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5" />,
      label: "Manajemen Pakan",
      active: false,
      page: "feed-management",
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Manajemen Produk",
      active: false,
      page: "product-management",
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Pesanan Masuk",
      active: false,
      page: "orders",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Manajemen User",
      active: false,
      page: "user-management",
    },
  ];

  // 3. Type annotation pada parameter 'status' dihapus
  const getStatusColor = (status) => {
    switch (status) {
      case "good":
        return "bg-[#10b981] text-white";
      case "warning":
        return "bg-[#f59e0b] text-white";
      case "danger":
        return "bg-[#ef4444] text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // 4. Type annotation pada parameter 'status' dihapus
  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20";
      case "Diproses":
        return "bg-[#0891b2]/10 text-[#0891b2] border-[#0891b2]/20";
      default:
        return "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-border">
        <div className="p-6">
          <h2 className="text-foreground mb-1">Admin Panel</h2>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            Kelola budidaya Anda
          </p>
        </div>
        <nav className="px-3 space-y-1">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-foreground mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Selamat datang kembali! Berikut ringkasan kondisi tambak Anda hari
              ini.
            </p>
          </div>

          {/* Main Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-[#0891b2]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">Status Kualitas Air</p>
                  <Droplet className="w-5 h-5 text-[#0891b2]" />
                </div>
                <p
                  className="text-foreground"
                  style={{ fontSize: "1.75rem", fontWeight: 700 }}
                >
                  Sangat Baik
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-4 h-4 text-[#10b981]" />
                  <span
                    className="text-[#10b981]"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Semua parameter normal
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#f59e0b]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">
                    Jadwal Pakan Berikutnya
                  </p>
                  <UtensilsCrossed className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <p
                  className="text-foreground"
                  style={{ fontSize: "1.75rem", fontWeight: 700 }}
                >
                  2 Jam
                </p>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  Pukul 15:00 WIB
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#10b981]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">Pesanan Baru</p>
                  <ShoppingBag className="w-5 h-5 text-[#10b981]" />
                </div>
                <p
                  className="text-foreground"
                  style={{ fontSize: "1.75rem", fontWeight: 700 }}
                >
                  12
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-[#10b981]" />
                  <span
                    className="text-[#10b981]"
                    style={{ fontSize: "0.875rem" }}
                  >
                    +8% dari kemarin
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#8b5cf6]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground">Stok Produk</p>
                  <Package className="w-5 h-5 text-[#8b5cf6]" />
                </div>
                <p
                  className="text-foreground"
                  style={{ fontSize: "1.75rem", fontWeight: 700 }}
                >
                  580 kg
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-[#f59e0b]" />
                  <span
                    className="text-[#f59e0b]"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Perlu restock
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Water Quality Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Tren Kualitas Air (24 Jam)</CardTitle>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  Monitoring suhu dan pH air secara real-time
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={waterQualityTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="time"
                        stroke="#64748b"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #cbd5e1",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="suhu"
                        stroke="#0891b2"
                        strokeWidth={2}
                        name="Suhu (°C)"
                        dot={{ fill: "#0891b2", r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="ph"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="pH"
                        dot={{ fill: "#10b981", r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-4 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#0891b2]" />
                    <span
                      className="text-muted-foreground"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Suhu (°C)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                    <span
                      className="text-muted-foreground"
                      style={{ fontSize: "0.875rem" }}
                    >
                      pH
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Prediction Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Prediksi Kualitas Air (AI)
                </CardTitle>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  Prediksi kondisi 6-12 jam ke depan
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiPredictions.map((prediction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-foreground mb-1">
                          {prediction.parameter}
                        </p>
                        <p
                          className="text-muted-foreground"
                          style={{ fontSize: "0.875rem" }}
                        >
                          {prediction.prediction}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {prediction.trend === "up" && (
                          <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
                        )}
                        {prediction.trend === "down" && (
                          <TrendingDown className="w-4 h-4 text-[#ef4444]" />
                        )}
                        {prediction.trend === "stable" && (
                          <div className="w-4 h-0.5 bg-[#10b981]" />
                        )}
                        <Badge className={getStatusColor(prediction.status)}>
                          {prediction.status === "good" ? "Baik" : "Perhatian"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => onNavigate("water-monitoring")}
                >
                  Lihat Detail Monitoring
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pesanan Terbaru</CardTitle>
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: "0.875rem" }}
                  >
                    5 pesanan terakhir yang masuk
                  </p>
                </div>
                <Button variant="outline" onClick={() => onNavigate("orders")}>
                  Lihat Semua
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pesanan</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.qty}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getOrderStatusColor(order.status)}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
