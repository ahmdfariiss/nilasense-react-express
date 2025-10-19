import { useState } from "react";
import {
  Droplet,
  UtensilsCrossed,
  ArrowRight,
  BarChart3,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaterQualityPage } from "./WaterQualityPage";
import { FeedSchedulePage } from "./FeedSchedulePage";

// Quick stats data
const quickStats = {
  waterQuality: {
    suhu: "28°C",
    ph: "7.2",
    status: "Normal",
    lastUpdate: "5 menit yang lalu"
  },
  feedSchedule: {
    nextFeed: "18:00",
    todayTotal: "15 kg",
    status: "Menunggu",
    lastUpdate: "2 jam yang lalu"
  }
};

export function UserMonitoringPage({ initialView = "dashboard" }) {
  const [currentView, setCurrentView] = useState(initialView); // dashboard, water, feed

  // Render different views based on currentView state
  if (currentView === "water") {
    return <WaterQualityPage onBack={() => setCurrentView("dashboard")} />;
  }

  if (currentView === "feed") {
    return <FeedSchedulePage onBack={() => setCurrentView("dashboard")} />;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Normal":
        return <Badge className="bg-[#10b981] text-white">Normal</Badge>;
      case "Perhatian":
        return <Badge className="bg-[#f59e0b] text-white">Perhatian</Badge>;
      case "Menunggu":
        return <Badge className="bg-[#f59e0b] text-white">Menunggu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Dashboard view - simple navigation hub
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Dashboard Monitoring</h1>
          <p className="text-muted-foreground">
            Pantau kondisi kolam Anda dengan mudah
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Water Quality Quick Stats */}
          <Card className="border-l-4 border-l-[#0891b2] hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setCurrentView("water")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0891b2]/10 rounded-lg">
                    <Droplet className="w-6 h-6 text-[#0891b2]" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold">Kualitas Air</h3>
                    <p className="text-muted-foreground text-sm">
                      Update: {quickStats.waterQuality.lastUpdate}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-muted-foreground text-sm">Suhu</p>
                  <p className="text-foreground font-semibold text-lg">
                    {quickStats.waterQuality.suhu}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">pH</p>
                  <p className="text-foreground font-semibold text-lg">
                    {quickStats.waterQuality.ph}
                  </p>
                </div>
              </div>
              
              {getStatusBadge(quickStats.waterQuality.status)}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView("water");
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Lihat Detail Monitoring
              </Button>
            </CardContent>
          </Card>

          {/* Feed Schedule Quick Stats */}
          <Card className="border-l-4 border-l-[#f59e0b] hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setCurrentView("feed")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#f59e0b]/10 rounded-lg">
                    <UtensilsCrossed className="w-6 h-6 text-[#f59e0b]" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold">Jadwal Pakan</h3>
                    <p className="text-muted-foreground text-sm">
                      Update: {quickStats.feedSchedule.lastUpdate}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-muted-foreground text-sm">Jadwal Berikutnya</p>
                  <p className="text-foreground font-semibold text-lg">
                    {quickStats.feedSchedule.nextFeed}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Hari Ini</p>
                  <p className="text-foreground font-semibold text-lg">
                    {quickStats.feedSchedule.todayTotal}
                  </p>
                </div>
              </div>
              
              {getStatusBadge(quickStats.feedSchedule.status)}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView("feed");
                }}
              >
                <Clock className="w-4 h-4 mr-2" />
                Lihat Jadwal Lengkap
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Monitoring</CardTitle>
            <p className="text-muted-foreground text-sm">
              Pilih menu untuk melihat data monitoring secara detail
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-6 justify-start"
                onClick={() => setCurrentView("water")}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#0891b2]/10 rounded-lg">
                    <Droplet className="w-8 h-8 text-[#0891b2]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Monitoring Kualitas Air</h3>
                    <p className="text-muted-foreground text-sm">
                      Suhu, pH, oksigen, dan kekeruhan air
                    </p>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-6 justify-start"
                onClick={() => setCurrentView("feed")}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#f59e0b]/10 rounded-lg">
                    <UtensilsCrossed className="w-8 h-8 text-[#f59e0b]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Jadwal Pemberian Pakan</h3>
                    <p className="text-muted-foreground text-sm">
                      Jadwal otomatis dan manual pakan
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
