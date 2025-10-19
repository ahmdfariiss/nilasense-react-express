import { useState } from "react";
import {
  UtensilsCrossed,
  Package,
  Clock,
  RefreshCw,
  ArrowLeft,
  Home,
  ChevronRight,
  Droplet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export function FeedSchedulePage({ onBack, showBreadcrumb = false, onNavigate }) {
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
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Home className="w-4 h-4" />
              <span>Monitoring Kolam</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Jadwal Pakan</span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            )}
          </div>
          <h1 className="text-foreground mb-2">Jadwal Pemberian Pakan</h1>
          <p className="text-muted-foreground">
            Pantau jadwal pemberian pakan kolam Anda
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          {/* Quick Navigation */}
          {onNavigate && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate("monitoring")}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate("water-quality")}
              >
                <Droplet className="w-4 h-4 mr-2" />
                Kualitas Air
              </Button>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Feed Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-[#f59e0b]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-muted-foreground">Jadwal Berikutnya</p>
                <Clock className="w-5 h-5 text-[#f59e0b]" />
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
                <UtensilsCrossed className="w-5 h-5 text-[#0891b2]" />
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
        <Card className="mb-8">
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
      </div>
    </div>
  );
}