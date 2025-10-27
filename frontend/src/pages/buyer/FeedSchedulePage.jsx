import { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Package,
  Clock,
  RefreshCw,
  ArrowLeft,
  Home,
  ChevronRight,
  Droplet,
  AlertCircle,
  Loader2,
  CheckCircle,
  Play,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import feedService from "@/services/feedService";
import pondService from "@/services/pondService";
import { toast } from "sonner";

// Empty state component
const EmptyState = ({ message, onRefresh }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Jadwal</h3>
    <p className="text-muted-foreground mb-6 max-w-md">
      {message || "Belum ada jadwal pemberian pakan untuk kolam ini. Hubungi admin untuk menambahkan jadwal."}
    </p>
    <Button onClick={onRefresh} variant="outline">
      <RefreshCw className="w-4 h-4 mr-2" />
      Coba Lagi
    </Button>
  </div>
);

// Loading component
const LoadingState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
    <p className="text-muted-foreground">{message || "Memuat jadwal pakan..."}</p>
  </div>
);

export function FeedSchedulePage({ onBack, showBreadcrumb = false, onNavigate }) {
  // State management
  const [feedScheduleData, setFeedScheduleData] = useState([]);
  const [feedSummary, setFeedSummary] = useState(null);
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [updatingSchedule, setUpdatingSchedule] = useState(null);

  // Fetch ponds on component mount
  useEffect(() => {
    fetchPonds();
  }, []);

  // Fetch feed data when pond is selected
  useEffect(() => {
    if (selectedPond) {
      fetchFeedData();
    }
  }, [selectedPond]);

  const fetchPonds = async () => {
    try {
      setLoading(true);
      const result = await pondService.getAccessiblePonds();
      
      if (result.success) {
        setPonds(result.data);
        
        // Set default pond
        const defaultPond = pondService.getDefaultPond(result.data);
        if (defaultPond) {
          setSelectedPond(defaultPond);
        } else if (result.data.length === 0) {
          setError("Belum ada kolam yang tersedia. Silakan hubungi admin untuk menambahkan kolam.");
        }
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError("Gagal memuat data kolam");
      toast.error("Gagal memuat data kolam");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedData = async () => {
    if (!selectedPond) return;
    
    try {
      setRefreshing(true);
      setError(null);

      // Fetch today's feed schedules and summary in parallel
      const [schedulesResult, summaryResult] = await Promise.all([
        feedService.getAccessibleFeedSchedules(selectedPond.id),
        feedService.getTodayFeedSummary(selectedPond.id)
      ]);

      if (schedulesResult.success) {
        const formattedSchedules = feedService.formatSchedulesForTable(schedulesResult.data);
        setFeedScheduleData(formattedSchedules);
      } else {
        setError(schedulesResult.message);
        if (schedulesResult.message !== 'Belum ada jadwal pakan') {
          toast.error(schedulesResult.message);
        }
      }

      if (summaryResult.success) {
        setFeedSummary(summaryResult.data);
      } else {
        // Use fallback calculation if summary fails
        const stats = feedService.getScheduleStatistics(schedulesResult.data || []);
        setFeedSummary(stats);
      }
    } catch (err) {
      setError("Gagal memuat data jadwal pakan");
      toast.error("Gagal memuat data jadwal pakan");
    } finally {
      setRefreshing(false);
    }
  };

  const handlePondChange = (pondId) => {
    const pond = ponds.find(p => p.id.toString() === pondId);
    if (pond) {
      setSelectedPond(pond);
      pondService.saveSelectedPond(pondId);
    }
  };

  const handleRefresh = () => {
    fetchFeedData();
  };

  const handleStatusUpdate = async (scheduleId, newStatus) => {
    try {
      setUpdatingSchedule(scheduleId);
      
      const result = newStatus === 'completed' 
        ? await feedService.markFeedAsCompleted(scheduleId)
        : await feedService.markFeedAsPending(scheduleId);

      if (result.success) {
        toast.success(result.message);
        // Refresh data to get updated status
        await fetchFeedData();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Gagal mengubah status jadwal");
    } finally {
      setUpdatingSchedule(null);
    }
  };

  const getFeedStatusBadge = (status) => {
    const statusClass = feedService.getStatusBadgeClass(status);
    const statusLabel = feedService.getStatusLabel(status);
    
    return <Badge className={statusClass}>{statusLabel}</Badge>;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState message="Memuat data kolam..." />
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !selectedPond) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState message={error} onRefresh={fetchPonds} />
        </div>
      </div>
    );
  }

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
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-foreground mb-2">Jadwal Pemberian Pakan</h1>
              <p className="text-muted-foreground">
                Pantau jadwal pemberian pakan kolam Anda
              </p>
            </div>
            
            {/* Pond Selector */}
            {ponds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Kolam:</span>
                <Select
                  value={selectedPond?.id.toString()}
                  onValueChange={handlePondChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Pilih kolam" />
                  </SelectTrigger>
                  <SelectContent>
                    {ponds.map((pond) => (
                      <SelectItem key={pond.id} value={pond.id.toString()}>
                        {pond.name}
                        {pond.location && (
                          <span className="text-muted-foreground ml-2">
                            ({pond.location})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Memuat...' : 'Refresh Data'}
            </Button>
          </div>
        </div>

        {/* Feed Info Cards */}
        {!feedSummary ? (
          <div className="mb-8">
            <EmptyState 
              message="Belum ada jadwal pakan untuk kolam ini. Hubungi admin untuk menambahkan jadwal."
              onRefresh={handleRefresh}
            />
          </div>
        ) : (
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
                  {feedSummary.nextFeedTime ? 
                    feedSummary.nextFeedTime.substring(0, 5) : 
                    '--:--'
                  }
                </p>
                <Badge className="bg-[#f59e0b] text-white">
                  {feedSummary.nextFeedTime ? 
                    feedService.getFeedSessionType(feedSummary.nextFeedTime) : 
                    'Tidak ada'
                  }
                </Badge>
                {feedSummary.nextFeedTime && (
                  <p className="text-muted-foreground text-xs mt-2">
                    {feedService.getRelativeTime(feedSummary.nextFeedTime)}
                  </p>
                )}
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
                  {feedSummary.totalAmount || 0} kg
                </p>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  {feedSummary.totalSchedules || 0}x pemberian
                </p>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.75rem" }}
                >
                  Selesai: {feedSummary.completedAmount || 0} kg
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
                  {feedSummary.feedTypes || 'Belum ada jadwal'}
                </p>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  Status: {feedSummary.status || 'Belum ada jadwal'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feed Schedule Table */}
        {feedSummary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Jadwal Pemberian Pakan Hari Ini</CardTitle>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                Jadwal otomatis pemberian pakan kolam - {selectedPond?.name}
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
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedScheduleData.length > 0 ? (
                    feedScheduleData.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">{schedule.time}</TableCell>
                        <TableCell>{schedule.type}</TableCell>
                        <TableCell>{schedule.amount}</TableCell>
                        <TableCell>{schedule.feedType}</TableCell>
                        <TableCell>
                          {getFeedStatusBadge(schedule.rawData.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {schedule.rawData.status === 'pending' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(schedule.id, 'completed')}
                                disabled={updatingSchedule === schedule.id}
                                className="text-green-600 hover:text-green-700"
                              >
                                {updatingSchedule === schedule.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                                <span className="ml-1 hidden sm:inline">Selesai</span>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(schedule.id, 'pending')}
                                disabled={updatingSchedule === schedule.id}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                {updatingSchedule === schedule.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Play className="w-3 h-3" />
                                )}
                                <span className="ml-1 hidden sm:inline">Reset</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-muted-foreground">
                          Belum ada jadwal pakan untuk hari ini
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

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
