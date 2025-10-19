import api from './api';

export const dashboardService = {
  // Get overall dashboard statistics
  async getDashboardStats() {
    try {
      const [pondsResponse, productsResponse] = await Promise.all([
        api.get('/api/ponds'),
        api.get('/api/products')
      ]);

      const ponds = pondsResponse.data;
      const products = productsResponse.data;

      // Calculate total stock
      const totalStock = products.reduce((sum, product) => sum + (product.stock_kg || 0), 0);
      
      // Calculate low stock products (less than 50kg)
      const lowStockProducts = products.filter(product => (product.stock_kg || 0) < 50);

      return {
        totalPonds: ponds.length,
        totalProducts: products.length,
        totalStock,
        lowStockCount: lowStockProducts.length,
        lowStockProducts
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get water quality overview for all ponds
  async getWaterQualityOverview() {
    try {
      const pondsResponse = await api.get('/api/ponds');
      const ponds = pondsResponse.data;

      if (ponds.length === 0) {
        return {
          overallStatus: 'no-data',
          statusCounts: { good: 0, warning: 0, danger: 0 },
          pondStatuses: [],
          latestReadings: []
        };
      }

      // Get latest water quality data for each pond
      const waterQualityPromises = ponds.map(async (pond) => {
        try {
          const response = await api.get(`/api/monitoring/logs/${pond.id}?limit=1`);
          const logs = response.data;
          
          if (logs.length === 0) {
            return {
              pondId: pond.id,
              pondName: pond.name,
              status: 'no-data',
              lastUpdate: null,
              readings: null
            };
          }

          const latest = logs[0];
          const status = this.determineWaterQualityStatus(latest);

          return {
            pondId: pond.id,
            pondName: pond.name,
            status,
            lastUpdate: latest.recorded_at,
            readings: {
              temperature: latest.temperature,
              ph: latest.ph,
              oxygen: latest.dissolved_oxygen,
              turbidity: latest.turbidity
            }
          };
        } catch (error) {
          console.error(`Error fetching water quality for pond ${pond.id}:`, error);
          return {
            pondId: pond.id,
            pondName: pond.name,
            status: 'error',
            lastUpdate: null,
            readings: null
          };
        }
      });

      const pondStatuses = await Promise.all(waterQualityPromises);

      // Calculate status counts
      const statusCounts = pondStatuses.reduce((counts, pond) => {
        counts[pond.status] = (counts[pond.status] || 0) + 1;
        return counts;
      }, { good: 0, warning: 0, danger: 0, 'no-data': 0, error: 0 });

      // Determine overall status
      let overallStatus = 'good';
      if (statusCounts.danger > 0) {
        overallStatus = 'danger';
      } else if (statusCounts.warning > 0) {
        overallStatus = 'warning';
      } else if (statusCounts.good === 0) {
        overallStatus = 'no-data';
      }

      return {
        overallStatus,
        statusCounts,
        pondStatuses,
        latestReadings: pondStatuses.filter(p => p.readings).map(p => p.readings)
      };
    } catch (error) {
      console.error('Error fetching water quality overview:', error);
      throw error;
    }
  },

  // Get feed schedule overview
  async getFeedScheduleOverview() {
    try {
      const pondsResponse = await api.get('/api/ponds');
      const ponds = pondsResponse.data;

      if (ponds.length === 0) {
        return {
          nextFeedingTime: null,
          totalSchedulesToday: 0,
          completedToday: 0,
          pendingToday: 0,
          upcomingFeedings: []
        };
      }

      // Get today's feed schedules for all ponds
      const today = new Date().toISOString().split('T')[0];
      const feedPromises = ponds.map(async (pond) => {
        try {
          const response = await api.get(`/api/feeds/accessible/${pond.id}?date=${today}`);
          return response.data.map(schedule => ({
            ...schedule,
            pondName: pond.name
          }));
        } catch (error) {
          console.error(`Error fetching feeds for pond ${pond.id}:`, error);
          return [];
        }
      });

      const allFeeds = (await Promise.all(feedPromises)).flat();

      // Calculate statistics
      const totalSchedulesToday = allFeeds.length;
      const completedToday = allFeeds.filter(feed => feed.is_done).length;
      const pendingToday = totalSchedulesToday - completedToday;

      // Find next feeding time
      const now = new Date();
      const upcomingFeedings = allFeeds
        .filter(feed => !feed.is_done)
        .map(feed => {
          const feedDateTime = new Date(`${feed.feed_date}T${feed.feed_time}`);
          return {
            ...feed,
            feedDateTime,
            timeUntil: feedDateTime.getTime() - now.getTime()
          };
        })
        .filter(feed => feed.timeUntil > 0)
        .sort((a, b) => a.timeUntil - b.timeUntil);

      const nextFeedingTime = upcomingFeedings.length > 0 ? upcomingFeedings[0] : null;

      return {
        nextFeedingTime,
        totalSchedulesToday,
        completedToday,
        pendingToday,
        upcomingFeedings: upcomingFeedings.slice(0, 5) // Next 5 feedings
      };
    } catch (error) {
      console.error('Error fetching feed schedule overview:', error);
      throw error;
    }
  },

  // Get water quality trend data for charts
  async getWaterQualityTrend(pondId = null, hours = 24) {
    try {
      let trendData = [];

      if (pondId) {
        // Get trend for specific pond
        const response = await api.get(`/api/monitoring/logs/${pondId}?hours=${hours}`);
        trendData = response.data;
      } else {
        // Get trend for all ponds (average)
        const pondsResponse = await api.get('/api/ponds');
        const ponds = pondsResponse.data;

        if (ponds.length === 0) return [];

        const trendPromises = ponds.map(async (pond) => {
          try {
            const response = await api.get(`/api/monitoring/logs/${pond.id}?hours=${hours}`);
            return response.data;
          } catch (error) {
            console.error(`Error fetching trend for pond ${pond.id}:`, error);
            return [];
          }
        });

        const allTrends = await Promise.all(trendPromises);
        
        // Combine and average data by time intervals
        const combinedData = {};
        allTrends.flat().forEach(log => {
          const timeKey = new Date(log.recorded_at).toISOString().slice(0, 16); // Group by hour
          if (!combinedData[timeKey]) {
            combinedData[timeKey] = {
              time: timeKey,
              temperature: [],
              ph: [],
              oxygen: [],
              turbidity: []
            };
          }
          combinedData[timeKey].temperature.push(log.temperature);
          combinedData[timeKey].ph.push(log.ph);
          combinedData[timeKey].oxygen.push(log.dissolved_oxygen);
          combinedData[timeKey].turbidity.push(log.turbidity);
        });

        // Calculate averages
        trendData = Object.values(combinedData).map(group => ({
          recorded_at: group.time,
          temperature: group.temperature.reduce((a, b) => a + b, 0) / group.temperature.length,
          ph: group.ph.reduce((a, b) => a + b, 0) / group.ph.length,
          dissolved_oxygen: group.oxygen.reduce((a, b) => a + b, 0) / group.oxygen.length,
          turbidity: group.turbidity.reduce((a, b) => a + b, 0) / group.turbidity.length
        })).sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
      }

      // Format for chart display
      return trendData.map(log => ({
        time: new Date(log.recorded_at).toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        suhu: parseFloat(log.temperature.toFixed(1)),
        ph: parseFloat(log.ph.toFixed(1)),
        oksigen: parseFloat(log.dissolved_oxygen.toFixed(1)),
        kekeruhan: parseFloat(log.turbidity.toFixed(1))
      }));
    } catch (error) {
      console.error('Error fetching water quality trend:', error);
      throw error;
    }
  },

  // Determine water quality status based on readings
  determineWaterQualityStatus(readings) {
    const { temperature, ph, dissolved_oxygen, turbidity } = readings;

    // Define optimal ranges
    const ranges = {
      temperature: { min: 25, max: 30 },
      ph: { min: 6.5, max: 8.5 },
      dissolved_oxygen: { min: 5, max: 15 },
      turbidity: { min: 0, max: 25 }
    };

    let warningCount = 0;
    let dangerCount = 0;

    // Check each parameter
    if (temperature < ranges.temperature.min - 2 || temperature > ranges.temperature.max + 2) {
      dangerCount++;
    } else if (temperature < ranges.temperature.min || temperature > ranges.temperature.max) {
      warningCount++;
    }

    if (ph < ranges.ph.min - 0.5 || ph > ranges.ph.max + 0.5) {
      dangerCount++;
    } else if (ph < ranges.ph.min || ph > ranges.ph.max) {
      warningCount++;
    }

    if (dissolved_oxygen < ranges.dissolved_oxygen.min - 1) {
      dangerCount++;
    } else if (dissolved_oxygen < ranges.dissolved_oxygen.min) {
      warningCount++;
    }

    if (turbidity > ranges.turbidity.max + 10) {
      dangerCount++;
    } else if (turbidity > ranges.turbidity.max) {
      warningCount++;
    }

    // Determine overall status
    if (dangerCount > 0) return 'danger';
    if (warningCount > 0) return 'warning';
    return 'good';
  },

  // Format time until next feeding
  formatTimeUntil(milliseconds) {
    if (milliseconds <= 0) return 'Sekarang';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} jam ${minutes} menit`;
    }
    return `${minutes} menit`;
  },

  // Get status display text
  getStatusText(status) {
    switch (status) {
      case 'good': return 'Sangat Baik';
      case 'warning': return 'Perlu Perhatian';
      case 'danger': return 'Berbahaya';
      case 'no-data': return 'Tidak Ada Data';
      case 'error': return 'Error';
      default: return 'Tidak Diketahui';
    }
  },

  // Get status color classes
  getStatusColor(status) {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'danger': return 'text-red-600 bg-red-50 border-red-200';
      case 'no-data': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }
};

export default dashboardService;