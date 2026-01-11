import React, { useState, useEffect } from 'react';
import {
  Package, 
  ShoppingCart,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { KPICard, Card } from '../../components/admin/Card';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useSocket } from '../../context/SocketContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AdminDashboard = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
    totalRevenue: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    returningCustomers: 0,
    verifiedUsers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  });

  const [salesTrendData, setSalesTrendData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('Monthly'); // Weekly, Monthly, Yearly
  const [topSellingData, setTopSellingData] = useState([]); // Server-side data
  const [loadingTopSelling, setLoadingTopSelling] = useState(false);
  
  const [allOrdersRef, setAllOrdersRef] = useState([]); // Store raw orders for filtering
  const [allProductsRef, setAllProductsRef] = useState([]); // Store raw products for category lookup
  const socket = useSocket();

  const COLORS = ['#3D7F57', '#5FAF78', '#81CF99', '#A3DFBA', '#C5EFDB'];

  // ------------------------------------------------------------------
  // 0. SOCKET LISTENER (REAL-TIME UPDATES)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (socket) {
      socket.on("order:new", (newOrder) => {
        // Prepend new order to current list
        setAllOrdersRef((prevOrders) => {
          const updated = [newOrder, ...prevOrders];
          // Update recent orders immediately for UI responsiveness
          return updated;
        });
        
        // Note: The `useEffect` listening to `allOrdersRef` will trigger 
        // `recalculateMetrics` automatically, updating all charts/stats.
        
        // Trigger Refetch of Top Selling Data
        fetchTopSellingProducts();
      });

      // Cleanup
      return () => {
        socket.off("order:new");
      };
    }
  }, [socket]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // ------------------------------------------------------------------
  // 1. FILTER LOGIC
  // ------------------------------------------------------------------
  const filterOrdersByRange = (orders, range) => {
      const now = new Date();
      const start = new Date();
      
      if (range === 'Weekly') {
          start.setDate(now.getDate() - 7);
      } else if (range === 'Monthly') {
          start.setMonth(now.getMonth(), 1); // Start of current month
      } else if (range === 'Yearly') {
          start.setFullYear(now.getFullYear(), 0, 1); // Start of current year
      }
      
      // Setup day start time
      start.setHours(0,0,0,0);

      return orders.filter(o => new Date(o.rawDate || o.createdAt) >= start);
  };

  // ------------------------------------------------------------------
  // 2. RE-CALCULATE METRICS WHEN RANGE/DATA CHANGES
  // ------------------------------------------------------------------
  useEffect(() => {
      if (allOrdersRef.length > 0) {
          recalculateMetrics();
      }
      
      // Fetch Top Selling on Range Change + Polling
      fetchTopSellingProducts();
      
      // Auto-refresh every 30 seconds
      const intervalId = setInterval(fetchTopSellingProducts, 30000);
      
      return () => clearInterval(intervalId);
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, allOrdersRef]);

  const recalculateMetrics = () => {
      const filteredOrders = filterOrdersByRange(allOrdersRef, timeRange);

      const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalPrice || order.amount || 0), 0);
      const avgOrder = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
      
      // Calculate order status counts
      // Note: Backend might return 'status' or 'orderStatus' depending on endpoint (admin/all returns 'status')
      const pendingOrders = filteredOrders.filter(o => (o.status || o.orderStatus) === 'Pending' || (o.status || o.orderStatus) === 'Processing').length;
      const deliveredOrders = filteredOrders.filter(o => (o.status || o.orderStatus) === 'Delivered').length;
      const cancelledOrders = filteredOrders.filter(o => (o.status || o.orderStatus) === 'Cancelled').length;
      
      // Update Trends
      const salesTrend = generateSalesTrend(filteredOrders, timeRange);
      setSalesTrendData(salesTrend);
      
      // Update Stats
      setStats(prev => ({
          ...prev,
          totalOrders: filteredOrders.length,
          totalRevenue: totalRevenue,
          avgOrderValue: avgOrder,
          pendingOrders,
          deliveredOrders,
          cancelledOrders,
          conversionRate: filteredOrders.length > 0 ? ((deliveredOrders / filteredOrders.length) * 100).toFixed(1) : 0
      }));
  };

  // ------------------------------------------------------------------
  // 3. FETCH INITIAL DATA
  // ------------------------------------------------------------------
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const loginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { headers: { authorization: `Bearer ${loginToken}` } };

      const [ordersRes, usersRes, productsRes] = await Promise.all([
        axios.get(`${serverUrl}/orders/all`, headers),
        axios.get(`${serverUrl}/orders/users`, headers),
        axios.get(`${serverUrl}/api/v1/products`)
      ]);

      if (ordersRes.data.success) {
        const orders = ordersRes.data.orders || []; // Note: route/orders/all returns { orders: [...] }
        setAllOrdersRef(orders);
      }

      if (usersRes.data.success) {
        const users = usersRes.data.users || [];
        const verifiedUsers = users.filter(u => u.status === 'Verified').length;
        const returningRate = users.length > 0 ? ((verifiedUsers / users.length) * 100).toFixed(1) : 0;
        
        setStats(prev => ({
          ...prev,
          totalVisits: users.length * 15, 
          verifiedUsers,
          returningCustomers: returningRate
        }));
      }

      if (productsRes.data.products) {
        const products = productsRes.data.products;
        setAllProductsRef(products); // Save products for Category mapping
        const lowStock = products.filter(p => p.stock <= 5).length;
        
        // Category Pie Chart (Overall, NOT filtered by time usually, but we can make it filtered too)
        // Let's keep Pie Chart Overall for inventory check, or filtered for sales performance.
        // User asked "Category-wise Top Selling", logic implies SALES based.
        // The Pie Chart "categoryData" was stock value based in old code. 
        // Let's update Pie Chart to be SALES based using filtered orders if meaningful, 
        // OR keep stock value but add new Section for Top Selling.
        // Plan: Keep Pie Chart as is (Stock value) or switch to Sales? 
        // Context: "Sales distribution by category" (Pie label). Code was using (price * stock). That is Inventory Value, NOT Sales.
        // Let's fix the Pie Chart to be SALES based from Orders if desired, or leave as is. User didn't explicitly ask to fix Pie Chart.
        // I will implement "Top Selling Products" separately as requested.
        

        
        setStats(prev => ({
          ...prev,
          totalProducts: products.length,
          lowStockCount: lowStock
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSellingProducts = async () => {
      try {
          setLoadingTopSelling(true);
          const loginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
          
          const response = await axios.get(`${serverUrl}/orders/dashboard/top-selling`, {
              params: { range: timeRange.toLowerCase() },
              headers: { authorization: `Bearer ${loginToken}` }
          });
          
          if (response.data.success) {
              setTopSellingData(response.data.data);
          }
      } catch (error) {
          console.error("Failed to fetch top selling:", error);
          setTopSellingData([]);
      } finally {
          setLoadingTopSelling(false);
      }
  };

  // ------------------------------------------------------------------
  // 4. CHART DATA GENERATORS
  // ------------------------------------------------------------------
  const generateSalesTrend = (orders, range) => {
    let data = [];
    
    if (range === 'Weekly') {
        // Last 7 days
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
             const d = new Date(now);
             d.setDate(d.getDate() - i);
             const dayName = days[d.getDay()];
             
             // Filter orders for this specific day
             const dailyOrders = orders.filter(o => {
                 const od = new Date(o.rawDate || o.createdAt);
                 return od.getDate() === d.getDate() && od.getMonth() === d.getMonth();
             });
             
             data.push({
                 month: dayName, // Using 'month' key to reuse Chart mapping code
                 sales: dailyOrders.reduce((sum, o) => sum + (o.totalPrice || o.amount || 0), 0),
                 orders: dailyOrders.length
             });
        }
    } else if (range === 'Monthly') {
         // Current Month (by weeks) or just Last 12 months? 
         // "Monthly" usually implies "This Month" breakdown OR "Last 12 Months".
         // The prompt says: "Monthly: Current calendar month". Break it down by Weeks (1-4).
         
         const now = new Date();
         const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
         
         // Logic: Filter orders in current month
         const currentMonthOrders = orders.filter(o => {
             const d = new Date(o.rawDate || o.createdAt);
             return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
         });
         
         // Simple bucket by day / 7
         for(let i=0; i<5; i++){
             const wStart = i * 7 + 1;
             const wEnd = (i+1) * 7;
             const weekOrders = currentMonthOrders.filter(o => {
                 const d = new Date(o.rawDate || o.createdAt).getDate();
                 return d >= wStart && d <= wEnd;
             });
             data.push({
                 month: weeks[i],
                 sales: weekOrders.reduce((sum, o) => sum + (o.totalPrice || o.amount || 0), 0),
                 orders: weekOrders.length
             });
         }
         
    } else { // Yearly
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        
        for (let i = 0; i < 12; i++) {
             const monthOrders = orders.filter(o => {
                 const d = new Date(o.rawDate || o.createdAt);
                 return d.getMonth() === i && d.getFullYear() === currentYear;
             });
             data.push({
                 month: months[i],
                 sales: monthOrders.reduce((sum, o) => sum + (o.totalPrice || o.amount || 0), 0),
                 orders: monthOrders.length
             });
        }
    }
    return data;
  };


  // ------------------------------------------------------------------
  // 5. TOP SELLING PRODUCTS LOGIC (REFACTORED)
  // ------------------------------------------------------------------
  const topSellingProducts = topSellingData;
  
  // Calculate this derived state for rendering
  
  // Calculate this derived state for rendering


  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-white rounded-lg border shadow-sm p-1">
            {['Weekly', 'Monthly', 'Yearly'].map(range => (
                <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        timeRange === range 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    {range}
                </button>
            ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          change="+8.2%"
          trend="up"
          icon={ShoppingCart}
          color="green"
        />
        <KPICard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          change="+15.3%"
          trend="up"
          icon={DollarSign}
          color="purple"
        />
        <KPICard
          title="Low Stock Alerts"
          value={stats.lowStockCount}
          change="-2"
          trend="down"
          icon={AlertCircle}
          color="red"
        />
        <KPICard
          title="Total Products"
          value={stats.totalProducts || "245"}
          icon={Package}
          color="orange"
        />
        <KPICard
          title="Avg Order Value"
          value={`₹${Math.round(stats.avgOrderValue).toLocaleString()}`}
          change="+₹124"
          trend="up"
          icon={DollarSign}
          color="blue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend Chart */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <p className="text-sm text-gray-500">Monthly sales performance</p>
          </div>
          <div style={{ height: '300px' }}>
            <Line
              data={{
                labels: salesTrendData.map(d => d.month),
                datasets: [{
                  label: 'Sales',
                  data: salesTrendData.map(d => d.sales),
                  borderColor: '#3D7F57',
                  backgroundColor: 'rgba(61, 127, 87, 0.1)',
                  borderWidth: 3,
                  tension: 0.4,
                  fill: true
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: 'top' },
                  tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </Card>

        {/* Revenue vs Orders Chart */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue vs Orders</h3>
            <p className="text-sm text-gray-500">Comparison over months</p>
          </div>
          <div style={{ height: '300px' }}>
            <Bar
              data={{
                labels: salesTrendData.map(d => d.month),
                datasets: [
                  {
                    label: 'Sales',
                    data: salesTrendData.map(d => d.sales),
                    backgroundColor: '#3D7F57',
                    borderRadius: 8
                  },
                  {
                    label: 'Orders',
                    data: salesTrendData.map(d => d.orders),
                    backgroundColor: '#5FAF78',
                    borderRadius: 8
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: 'top' }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </Card>




      </div>

      {/* Top Selling Products (Time Based) */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h3 className="text-xl font-bold text-gray-900">Top Selling Products</h3>
                <p className="text-sm text-gray-500">Best performers based on {timeRange} sales</p>
            </div>
            
            {/* Range Toggle - Reusing main range state for consistency across dashboard */}
            <div className="flex bg-white rounded-lg border shadow-sm p-1">
                {['Weekly', 'Monthly', 'Yearly'].map(range => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            timeRange === range 
                            ? 'bg-emerald-600 text-white shadow-sm' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        {range}
                    </button>
                ))}
            </div>
        </div>
        
        {/* Products Table */}
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                            <th className="text-center py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Units Sold</th>
                            <th className="text-right py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {topSellingProducts.length > 0 ? (
                            topSellingProducts.map((product, idx) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-bold text-gray-800">{product.productName}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <span className="text-sm text-gray-500 font-medium">{product.unitsSold}</span>
                                    </td>
                                    <td className="py-3 px-6 text-right">
                                        <span className="text-sm font-bold text-emerald-600">₹{product.revenue.toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-gray-400 italic">
                                    No sales in this period
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {loadingTopSelling && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            )}
        </Card>
      </div>


      </div>
    </AdminLayout>
  );
};

