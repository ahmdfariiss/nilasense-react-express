import { useState } from "react";
import {
  Calendar,
  Download,
  RefreshCw,
  Droplet,
  UtensilsCrossed,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Mock data for different time ranges
const generateMockData = (days) => {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      suhu: 26 + Math.random() * 3,
      ph: 7.0 + Math.random() * 0.5,
      kekeruhan: 10 + Math.random() * 10,
      oksigen: 6.0 + Math.random() * 1.5,
    });
  }

  return data;
};

const waterHistoryData = [
  {
    time: "14:00:00",
    date: "15 Okt 2025",
    suhu: "28°C",
    ph: "7.2",
    kekeruhan: "15 NTU",
    oksigen: "6.7 mg/L",
    status: "Normal",
  },
  {
    time: "13:00:00",
    date: "15 Okt 2025",
    suhu: "27°C",
    ph: "7.1",
    kekeruhan: "14 NTU",
    oksigen: "6.8 mg/L",
    status: "Normal",
  },
  {
    time: "12:00:00",
    date: "15 Okt 2025",
    suhu: "28°C",
    ph: "7.2",
    kekeruhan: "16 NTU",
    oksigen: "6.6 mg/L",
    status: "Normal",
  },
  {
    time: "11:00:00",
    date: "15 Okt 2025",
    suhu: "27°C",
    ph: "7.0",
    kekeruhan: "15 NTU",
    oksigen: "6.9 mg/L",
    status: "Normal",
  },
  {
    time: "10:00:00",
    date: "15 Okt 2025",
    suhu: "26°C",
    ph: "7.1",
    kekeruhan: "13 NTU",
    oksigen: "7.0 mg/L",
    status: "Normal",
  },
];

const feedScheduleData = [
  {
    time: "06:00",
    type: "Pagi",
    amount: "5 kg",
    status: "Selesai",
    feedType: "Pelet Protein Tinggi",
  },
  {
    time: "12:00",
    type: "Siang",
    amount: "5 kg",
    status: "Selesai",
    feedType: "Pelet Protein Tinggi",
  },
  {
    time: "18:00",
    type: "Sore",
    amount: "5 kg",
    status: "Menunggu",
    feedType: "Pelet Protein Tinggi",
  },
];

export function UserMonitoringPage() {
  const [timeRange, setTimeRange] = useState("7");
  const [chartData, setChartData] = useState(generateMockData(7));

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    setChartData(generateMockData(parseInt(value)));
  };

  const currentStatus = {
    suhu: { value: "28°C", status: "normal", min: 25, max: 30 },
    ph: { value: "7.2", status: "normal", min: 6.5, max: 8.5 },
    kekeruhan: { value: "15 NTU", status: "good", max: 25 },
    oksigen: { value: "6.7 mg/L", status: "good", min: 5.0 },
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "good":
        return <Badge className="bg-[#10b981] text-white">Sangat Baik</Badge>;
      case "normal":
        return <Badge className="bg-[#0891b2] text-white">Normal</Badge>;
      case "warning":
        return <Badge className="bg-[#f59e0b] text-white">Perhatian</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getFeedStatusBadge = (status) => {
    switch (status) {
      case "Selesai":
        return <Badge className="bg-[#10b981] text-white">Selesai</Badge>;
      case "Menunggu":
        return <Badge className="bg-[#f59e0b] text-white">Menunggu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Monitoring Kolam</h1>
          <p className="text-muted-foreground">
            Pantau kondisi kualitas air dan jadwal pemberian pakan kolam Anda
          </p>
        </div>

        {/* Tabs for Water and Feed Monitoring */}
        <Tabs defaultValue="water" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="water" className="flex items-center gap-2">
              <Droplet className="w-4 h-4" />
              Monitoring Air
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Jadwal Pakan
            </TabsTrigger>
          </TabsList>

          {/* Water Monitoring Tab */}
          <TabsContent value="water" className="space-y-6">
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Current Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-[#0891b2]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground">Suhu Air</p>
                    <Droplet className="w-5 h-5 text-[#0891b2]" />
                  </div>
                  <p
                    className="text-foreground mb-2"
                    style={{ fontSize: "2rem", fontWeight: 700 }}
                  >
                    {currentStatus.suhu.value}
                  </p>
                  {getStatusBadge(currentStatus.suhu.status)}
                  <p
                    className="text-muted-foreground mt-2"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Rentang: {currentStatus.suhu.min}°C -{" "}
                    {currentStatus.suhu.max}°C
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#10b981]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground">pH Air</p>
                    <Droplet className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <p
                    className="text-foreground mb-2"
                    style={{ fontSize: "2rem", fontWeight: 700 }}
                  >
                    {currentStatus.ph.value}
                  </p>
                  {getStatusBadge(currentStatus.ph.status)}
                  <p
                    className="text-muted-foreground mt-2"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Rentang: {currentStatus.ph.min} - {currentStatus.ph.max}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#06b6d4]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground">Oksigen Terlarut</p>
                    <Droplet className="w-5 h-5 text-[#06b6d4]" />
                  </div>
                  <p
                    className="text-foreground mb-2"
                    style={{ fontSize: "2rem", fontWeight: 700 }}
                  >
                    {currentStatus.oksigen.value}
                  </p>
                  {getStatusBadge(currentStatus.oksigen.status)}
                  <p
                    className="text-muted-foreground mt-2"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Minimal: {currentStatus.oksigen.min} mg/L
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#8b5cf6]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground">Kekeruhan</p>
                    <Droplet className="w-5 h-5 text-[#8b5cf6]" />
                  </div>
                  <p
                    className="text-foreground mb-2"
                    style={{ fontSize: "2rem", fontWeight: 700 }}
                  >
                    {currentStatus.kekeruhan.value}
                  </p>
                  {getStatusBadge(currentStatus.kekeruhan.status)}
                  <p
                    className="text-muted-foreground mt-2"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Maksimal: {currentStatus.kekeruhan.max} NTU
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Temperature Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Grafik Suhu Air</CardTitle>
                    <Select
                      value={timeRange}
                      onValueChange={handleTimeRangeChange}
                    >
                      <SelectTrigger className="w-[140px]">
                        <Calendar className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Hari Ini</SelectItem>
                        <SelectItem value="7">7 Hari</SelectItem>
                        <SelectItem value="30">30 Hari</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="date"
                          stroke="#64748b"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis
                          stroke="#64748b"
                          style={{ fontSize: "12px" }}
                          domain={[24, 32]}
                        />
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
                          strokeWidth={3}
                          name="Suhu (°C)"
                          dot={{ fill: "#0891b2", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* pH Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Grafik pH Air</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="date"
                          stroke="#64748b"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis
                          stroke="#64748b"
                          style={{ fontSize: "12px" }}
                          domain={[6, 8.5]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="ph"
                          stroke="#10b981"
                          strokeWidth={3}
                          name="pH"
                          dot={{ fill: "#10b981", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Turbidity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Grafik Kekeruhan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="date"
                          stroke="#64748b"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis
                          stroke="#64748b"
                          style={{ fontSize: "12px" }}
                          domain={[0, 30]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="kekeruhan"
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          name="Kekeruhan (NTU)"
                          dot={{ fill: "#8b5cf6", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Oxygen Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Grafik Oksigen Terlarut</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="date"
                          stroke="#64748b"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis
                          stroke="#64748b"
                          style={{ fontSize: "12px" }}
                          domain={[4, 9]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="oksigen"
                          stroke="#06b6d4"
                          strokeWidth={3}
                          name="Oksigen (mg/L)"
                          dot={{ fill: "#06b6d4", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* History Table */}
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Data Monitoring</CardTitle>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  Data monitoring terbaru dari sensor IoT
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Suhu</TableHead>
                        <TableHead>pH</TableHead>
                        <TableHead>Kekeruhan</TableHead>
                        <TableHead>Oksigen</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waterHistoryData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.time}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.suhu}</TableCell>
                          <TableCell>{row.ph}</TableCell>
                          <TableCell>{row.kekeruhan}</TableCell>
                          <TableCell>{row.oksigen}</TableCell>
                          <TableCell>
                            <Badge className="bg-[#10b981] text-white">
                              {row.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feed Schedule Tab */}
          <TabsContent value="feed" className="space-y-6">
            {/* Feed Info Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-[#f59e0b]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground">Jadwal Berikutnya</p>
                    <UtensilsCrossed className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                  <p
                    className="text-foreground mb-2"
                    style={{ fontSize: "2rem", fontWeight: 700 }}
                  >
                    18:00
                  </p>
                  <Badge className="bg-[#f59e0b] text-white">Pakan Sore</Badge>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#10b981]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground">
                      Total Pakan Hari Ini
                    </p>
                    <Package className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <p
                    className="text-foreground mb-2"
                    style={{ fontSize: "2rem", fontWeight: 700 }}
                  >
                    15 kg
                  </p>
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: "0.875rem" }}
                  >
                    3x pemberian
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#0891b2]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground">Jenis Pakan</p>
                    <Package className="w-5 h-5 text-[#0891b2]" />
                  </div>
                  <p
                    className="text-foreground"
                    style={{ fontSize: "1.125rem", fontWeight: 600 }}
                  >
                    Pelet Protein Tinggi
                  </p>
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: "0.875rem" }}
                  >
                    32% protein
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Feed Schedule Table */}
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Pemberian Pakan Hari Ini</CardTitle>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  Jadwal otomatis pemberian pakan kolam
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Sesi</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Jenis Pakan</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedScheduleData.map((schedule, index) => (
                      <TableRow key={index}>
                        <TableCell>{schedule.time}</TableCell>
                        <TableCell>{schedule.type}</TableCell>
                        <TableCell>{schedule.amount}</TableCell>
                        <TableCell>{schedule.feedType}</TableCell>
                        <TableCell>
                          {getFeedStatusBadge(schedule.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Feed Tips */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                  Tips Pemberian Pakan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-muted-foreground">
                    Berikan pakan secara teratur 3x sehari untuk pertumbuhan
                    optimal
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-muted-foreground">
                    Sesuaikan jumlah pakan dengan ukuran dan jumlah ikan
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-muted-foreground">
                    Gunakan pakan dengan kandungan protein minimal 28-32% untuk
                    ikan nila
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
