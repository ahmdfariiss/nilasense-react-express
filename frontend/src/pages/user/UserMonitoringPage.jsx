import { useState, useEffect } from "react";
import {
  Droplet,
  UtensilsCrossed,
  ArrowRight,
  BarChart3,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaterQualityPage } from "./WaterQualityPage";
import { FeedSchedulePage } from "./FeedSchedulePage";
import monitoringService from "../services/monitoringService";
import pondService from "../services/pondService";
import feedService from "../services/feedService";

// Loading component untuk dashboard
const DashboardLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    {[1, 2].map((i) => (
      <Card key={i} className="border-l-4 border-l-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-32"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="h-3 bg-gray-100 rounded w-16 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-100 rounded w-16 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-100 rounded w-20"></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export function UserMonitoringPage({ initialView = "dashboard" }) {
  const [currentView, setCurrentView] = useState(initialView);
  const [quickStats, setQuickStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPond, setSelectedPond] = useState(null);

  // Fetch quick stats on component mount
  useEffect(() => {
    fetchQuickStats();
  }, []);

  const fetchQuickStats = async () => {
    try {
      setLoading(true);
      
      // Get accessible ponds
      const pondsResult = await pondService.getAccessiblePonds();
      if (!pondsResult.success || pondsResult.data.length === 0) {
        setQuickStats({
          waterQuality: null,
          feedSchedule: null,
          error: "Belum ada kolam yang tersedia"
        });
        return;
      }

      // Get default pond
      const defaultPond = pondService.getDefaultPond(pondsResult.data);
      setSelectedPond(defaultPond);

      if (defaultPond) {
        // Get latest water quality data and feed summary in parallel
        const [waterResult, feedResult] = await Promise.all([
          monitoringService.getLatestWaterQuality(defaultPond.id),
          feedService.getTodayFeedSummary(defaultPond.id)
        ]);
        
        let waterQualityStats = null;
        if (waterResult.success && waterResult.data) {
          const latest = waterResult.data;
          const overallStatus = getOverallWaterStatus(latest);
          
          waterQualityStats = {
            suhu: `${latest.temperature}°C`,
            ph: latest.ph_level.toString(),
            status: overallStatus,
            lastUpdate: getRelativeTime(latest.logged_at)
          };
        }

        // Get feed schedule stats from real API
        let feedScheduleStats = null;
        if (feedResult.success && feedResult.data) {
          const summary = feedResult.data;
          feedScheduleStats = {
            nextFeed: summary.nextFeedTime ? summary.nextFeedTime.substring(0, 5) : '--:--',
            todayTotal: `${summary.totalAmount || 0} kg`,
            status: summary.status || 'Belum ada jadwal',
            lastUpdate: summary.nextFeedTime ? 
              feedService.getRelativeTime(summary.nextFeedTime) : 
              'Belum ada data'
          };
        } else {
          // Fallback if no feed data
          feedScheduleStats = {
            nextFeed: '--:--',
            todayTotal: '0 kg',
            status: 'Belum ada jadwal',
            lastUpdate: 'Belum ada data'
          };
        }

        setQuickStats({
          waterQuality: waterQualityStats,
          feedSchedule: feedScheduleStats,
          pondName: defaultPond.name
        });
      }
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      setQuickStats({
        waterQuality: null,
        feedSchedule: null,
        error: "Gagal memuat data"
      });
    } finally {
      setLoading(false);
    }
  };

  const getOverallWaterStatus = (log) => {
    const statuses = [
      monitoringService.getWaterQualityStatus(log.temperature, 'temperature'),
      monitoringService.getWaterQualityStatus(log.ph_level, 'ph_level'),
      monitoringService.getWaterQualityStatus(log.dissolved_oxygen, 'dissolved_oxygen'),
      monitoringService.getWaterQualityStatus(log.turbidity, 'turbidity')
    ];

    if (statuses.includes('warning')) return 'Perhatian';
    if (statuses.includes('good')) return 'Sangat Baik';
    return 'Normal';
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
  };

  // Render different views based on currentView state
  if (currentView === "water") {
    return <WaterQualityPage onBack={() => setCurrentView("dashboard")} />;
  }

  if (currentView === "feed") {
    return <FeedSchedulePage onBack={() => setCurrentView("dashboard")} />;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Sangat Baik":
        return <Badge className="bg-[#10b981] text-white">Sangat Baik</Badge>;
      case "Normal":
        return <Badge className="bg-[#0891b2] text-white">Normal</Badge>;
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
            {selectedPond && (
              <span className="ml-2 text-primary font-medium">
                - {selectedPond.name}
              </span>
            )}
          </p>
        </div>

        {/* Quick Stats Overview */}
        {loading ? (
          <DashboardLoading />
        ) : quickStats?.error ? (
          <div className="mb-8">
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak Ada Data</h3>
                <p className="text-muted-foreground mb-4">{quickStats.error}</p>
                <Button onClick={fetchQuickStats} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
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
                      Update: {quickStats?.waterQuality?.lastUpdate || 'Belum ada data'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
              
              {quickStats?.waterQuality ? (
                <>
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
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">Belum ada data monitoring</p>
                </div>
              )}
              
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
                      Update: {quickStats?.feedSchedule?.lastUpdate || 'Belum ada data'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-muted-foreground text-sm">Jadwal Berikutnya</p>
                  <p className="text-foreground font-semibold text-lg">
                    {quickStats?.feedSchedule?.nextFeed || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Hari Ini</p>
                  <p className="text-foreground font-semibold text-lg">
                    {quickStats?.feedSchedule?.todayTotal || '-'}
                  </p>
                </div>
              </div>
              
              {quickStats?.feedSchedule && getStatusBadge(quickStats.feedSchedule.status)}
              
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
        )}

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

export default UserMonitoringPage;
