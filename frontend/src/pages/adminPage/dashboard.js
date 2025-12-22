import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart,
  Users,
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
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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

// Set default font for Chart.js
ChartJS.defaults.font.family = "'Google Sans Flex', 'Lato', sans-serif";

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
  const [saleTrendData, setSalesTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3D7F57', '#5FAF78', '#81CF99', '#A3DFBA', '#C5EFDB'];

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const loginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { headers: { authorization: `Bearer ${loginToken}` } };

      // Fetch all data in parallel
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        axios.get(`${serverUrl}/orders/all`, headers),
        axios.get(`${serverUrl}/orders/users`, headers),
        axios.get(`${serverUrl}/api/v1/products`)
      ]);

      // Process orders data - Backend returns: { success: true, orders: [...], totalOrders: number }
      if (ordersRes.data.success) {
        const orders = ordersRes.data.orders || [];
        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;
        
        // Calculate order status counts - Backend uses: 'Processing', 'Delivered', 'Cancelled'
        const pendingOrders = orders.filter(o => o.status === 'Processing').length;
        const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
        const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
        
        // Generate monthly sales trend from orders
        const monthlySales = generateMonthlySalesData(orders);
        setSalesTrendData(monthlySales);
        
        
        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          avgOrderValue: avgOrder,
          pendingOrders,
          deliveredOrders,
          cancelledOrders,
          conversionRate: orders.length > 0 ? ((deliveredOrders / orders.length) * 100).toFixed(1) : 0
        }));
      }

      // Process users data - Backend returns: { success: true, users: [...], totalUsers: number, verifiedUsers: number }
      if (usersRes.data.success) {
        const users = usersRes.data.users || [];
        const verifiedCount = usersRes.data.verifiedUsers || users.filter(u => u.status === 'Verified').length;
        const returningRate = users.length > 0 ? ((verifiedCount / users.length) * 100).toFixed(1) : 0;
        
        setStats(prev => ({
          ...prev,
          totalVisits: users.length * 15, // Estimate based on user count
          verifiedUsers: verifiedCount,
          returningCustomers: returningRate
        }));
      }

      // Process products data
      if (productsRes.data.products) {
        const products = productsRes.data.products;
        const lowStock = products.filter(p => p.stock <= 5).length;
        
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

  // Generate monthly sales data from orders
  const generateMonthlySalesData = (orders) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const monthlyData = [];

    for (let i = 7; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.rawDate || order.date);
        const orderMonth = orderDate.getMonth();
        return orderMonth === monthIndex;
      });
      
      const monthSales = monthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
      
      monthlyData.push({
        month: months[monthIndex],
        sales: monthSales,
        orders: monthOrders.length
      });
    }
    
    return monthlyData;
  };



  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
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
      {/* Page Header */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store today.</p>
      </motion.div>

      {/* KPI Cards Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >

        <motion.div variants={fadeInUp}>
          <KPICard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            change="+8.2%"
            trend="up"
            icon={ShoppingCart}
            color="green"
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <KPICard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            change="+15.3%"
            trend="up"
            icon={DollarSign}
            color="purple"
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <KPICard
            title="Low Stock Alerts"
            value={stats.lowStockCount}
            change="-2"
            trend="down"
            icon={AlertCircle}
            color="red"
          />
        </motion.div>
      </motion.div>

      {/* Secondary KPIs */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        <motion.div variants={fadeInUp}>
          <KPICard
            title="Total Products"
            value={stats.totalProducts || "245"}
            icon={Package}
            color="orange"
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <KPICard
            title="Avg Order Value"
            value={`₹${Math.round(stats.avgOrderValue).toLocaleString()}`}
            change="+₹124"
            trend="up"
            icon={DollarSign}
            color="blue"
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <KPICard
            title="Returning Customers"
            value={`${stats.returningCustomers}%`}
            change="+2.1%"
            trend="up"
            icon={Users}
            color="purple"
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
              <p className="text-sm text-gray-500">Monthly sales performance</p>
            </div>
            <div style={{ height: '300px' }}>
              <Line
                data={{
                  labels: saleTrendData.map(d => d.month),
                  datasets: [{
                    label: 'Sales',
                    data: saleTrendData.map(d => d.sales),
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
        </motion.div>

        {/* Revenue vs Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenue vs Orders</h3>
              <p className="text-sm text-gray-500">Comparison over months</p>
            </div>
            <div style={{ height: '300px' }}>
              <Bar
                data={{
                  labels: saleTrendData.map(d => d.month),
                  datasets: [
                    {
                      label: 'Sales',
                      data: saleTrendData.map(d => d.sales),
                      backgroundColor: '#3D7F57',
                      borderRadius: 8
                    },
                    {
                      label: 'Orders',
                      data: saleTrendData.map(d => d.orders),
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
        </motion.div>

      </div>


    </AdminLayout>
  );
};

export default AdminDashboard;
export { AdminDashboard as Dashboard };