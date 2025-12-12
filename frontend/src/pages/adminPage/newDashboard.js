import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart,
  Users,
  DollarSign,
  AlertCircle,
  ArrowUp,
  ArrowDown
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
import { Line, Bar, Pie } from 'react-chartjs-2';
import { KPICard, Card } from '../../components/admin/Card';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

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
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesTrendData, setSalesTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
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

      // Process orders data
      if (ordersRes.data.success) {
        const orders = ordersRes.data.AllOrders || [];
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;
        
        // Calculate order status counts
        const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
        const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
        const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;
        
        // Generate monthly sales trend from orders
        const monthlySales = generateMonthlySalesData(orders);
        setSalesTrendData(monthlySales);
        
        setRecentOrders(orders.slice(0, 5));
        
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

      // Process users data
      if (usersRes.data.success) {
        const users = usersRes.data.users || [];
        const verifiedUsers = users.filter(u => u.emailVerificationStatus === 'verified').length;
        const returningRate = users.length > 0 ? ((verifiedUsers / users.length) * 100).toFixed(1) : 0;
        
        setStats(prev => ({
          ...prev,
          totalVisits: users.length * 15, // Estimate based on user count
          verifiedUsers,
          returningCustomers: returningRate
        }));
      }

      // Process products data
      if (productsRes.data.products) {
        const products = productsRes.data.products;
        const lowStock = products.filter(p => p.stock <= 5).length;
        
        // Generate category data from products
        const categoriesData = generateCategoryData(products);
        setCategoryData(categoriesData);
        
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
        const orderMonth = new Date(order.createdAt).getMonth();
        return orderMonth === monthIndex;
      });
      
      const monthSales = monthOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      
      monthlyData.push({
        month: months[monthIndex],
        sales: monthSales,
        orders: monthOrders.length
      });
    }
    
    return monthlyData;
  };

  // Generate category data from products
  const generateCategoryData = (products) => {
    const categoryMap = {};
    let totalValue = 0;

    products.forEach(product => {
      const category = product.category || 'Others';
      const value = (product.price || 0) * (product.stock || 0);
      
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += value;
      totalValue += value;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
        percentage: totalValue > 0 ? Math.round((value / totalValue) * 100) : 0
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Visits"
          value={stats.totalVisits.toLocaleString()}
          change="+12.5%"
          trend="up"
          icon={TrendingUp}
          color="blue"
        />
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
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Products"
          value={stats.totalProducts || "245"}
          icon={Package}
          color="orange"
        />
        <KPICard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change="+0.5%"
          trend="up"
          icon={TrendingUp}
          color="green"
        />
        <KPICard
          title="Avg Order Value"
          value={`₹${Math.round(stats.avgOrderValue).toLocaleString()}`}
          change="+₹124"
          trend="up"
          icon={DollarSign}
          color="blue"
        />
        <KPICard
          title="Returning Customers"
          value={`${stats.returningCustomers}%`}
          change="+2.1%"
          trend="up"
          icon={Users}
          color="purple"
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

        {/* Category Performance */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
            <p className="text-sm text-gray-500">Sales distribution by category</p>
          </div>
          <div style={{ height: '300px' }}>
            <Pie
              data={{
                labels: categoryData.map(d => `${d.name} (${d.percentage}%)`),
                datasets: [{
                  data: categoryData.map(d => d.value),
                  backgroundColor: COLORS,
                  borderWidth: 2,
                  borderColor: '#fff'
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: 'right' }
                }
              }}
            />
          </div>
        </Card>

        {/* Customer Growth */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Growth</h3>
            <p className="text-sm text-gray-500">New customers over time</p>
          </div>
          <div style={{ height: '300px' }}>
            <Line
              data={{
                labels: salesTrendData.map(d => d.month),
                datasets: [{
                  label: 'New Customers',
                  data: salesTrendData.map(d => d.orders),
                  borderColor: '#3D7F57',
                  backgroundColor: 'rgba(61, 127, 87, 0.2)',
                  borderWidth: 2,
                  tension: 0.4,
                  fill: true
                }]
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

      {/* Recent Orders Table */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <p className="text-sm text-gray-500">Latest customer orders</p>
          </div>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      #{order._id?.slice(-6)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{order.userName || 'Guest'}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-emerald-600">
                      ₹{order.totalPrice?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Live Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Live Visitors</p>
              <h3 className="text-3xl font-bold text-gray-900">24</h3>
              <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                <ArrowUp size={12} /> +3 from last hour
              </p>
            </div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
          <div>
            <p className="text-sm text-gray-600 mb-1">Abandoned Carts</p>
            <h3 className="text-3xl font-bold text-gray-900">12</h3>
            <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
              <ArrowDown size={12} /> -2 from yesterday
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div>
            <p className="text-sm text-gray-600 mb-1">Refund Requests</p>
            <h3 className="text-3xl font-bold text-gray-900">3</h3>
            <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
              Pending review
            </p>
          </div>
        </Card>
      </div>
      </div>
    </AdminLayout>
  );
};

