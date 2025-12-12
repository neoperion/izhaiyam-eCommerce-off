import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export const Dashboard = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
  
  const [stats, setStats] = useState({
    totalVisits: 12345,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    registeredUsers: 0,
    verifiedUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { allProductsData } = useSelector((state) => state.productsData);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProductsData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get login token for admin requests
      const loginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { headers: { authorization: `Bearer ${loginToken}` } };
      
      // Fetch products data
      const productsCount = allProductsData?.length || 0;
      const lowStock = allProductsData?.filter(p => p.stock <= 5).length || 0;
      
      // Calculate top selling products (by stock sold - lower stock = more sales)
      const sortedProducts = allProductsData?.slice()
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5) || [];
      
      // Fetch real orders data
      let ordersData = [];
      let totalRevenue = 0;
      try {
        const ordersResponse = await axios.get(`${serverUrl}/orders/all`, headers);
        if (ordersResponse.data.success) {
          ordersData = ordersResponse.data.orders;
          totalRevenue = ordersData.reduce((sum, order) => sum + (order.amount || 0), 0);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      
      // Fetch real users data
      let usersData = [];
      let verifiedCount = 0;
      try {
        const usersResponse = await axios.get(`${serverUrl}/orders/users`, headers);
        if (usersResponse.data.success) {
          usersData = usersResponse.data.users;
          verifiedCount = usersResponse.data.verifiedUsers;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      
      setStats({
        totalVisits: 12345, // Keep as mock for now
        totalOrders: ordersData.length,
        totalRevenue: totalRevenue,
        totalProducts: productsCount,
        lowStockProducts: lowStock,
        registeredUsers: usersData.length,
        verifiedUsers: verifiedCount,
      });
      
      setTopProducts(sortedProducts);
      setRecentOrders(ordersData.slice(0, 6));
      setRecentUsers(usersData.slice(0, 4));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full xl:px-[4%] px-[4%] lg:px-[2%]">
      <div className="container mx-auto">
        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
          <div className="bg-neutralColor rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
            <h3 className="text-sm md:text-base text-gray-600 font-medium">Total Visits</h3>
            <p className="text-2xl md:text-3xl font-bold text-primaryColor mt-2">{stats.totalVisits.toLocaleString()}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">Across lifetime</p>
          </div>
          
          <div className="bg-neutralColor rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
            <h3 className="text-sm md:text-base text-gray-600 font-medium">Total Orders</h3>
            <p className="text-2xl md:text-3xl font-bold text-primaryColor mt-2">{recentOrders.length}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">All time orders</p>
          </div>
          
          <div className="bg-neutralColor rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
            <h3 className="text-sm md:text-base text-gray-600 font-medium">Total Products</h3>
            <p className="text-2xl md:text-3xl font-bold text-primaryColor mt-2">{stats.totalProducts}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">Active products</p>
          </div>
          
          <div className="bg-neutralColor rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
            <h3 className="text-sm md:text-base text-gray-600 font-medium">Low Stock Alert</h3>
            <p className="text-2xl md:text-3xl font-bold text-red-600 mt-2">{stats.lowStockProducts}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">Needs attention</p>
          </div>
          
          <div className="bg-neutralColor rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm md:text-base text-gray-600 font-medium">Total Revenue</h3>
            <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">From all orders</p>
          </div>
        </div>

        {/* Recent Orders & Top Products - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="p-4 md:p-6 border-b">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 md:p-4 border-b hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm md:text-base">{order.customer}</div>
                        <div className="text-xs md:text-sm text-gray-500 mt-1">{order.product} • {order.date}</div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-sm md:text-base text-gray-800">₹{order.amount.toLocaleString()}</div>
                        <div className={`text-xs md:text-sm mt-1 ${
                          order.status === 'Delivered' ? 'text-green-600' : 
                          order.status === 'In Transit' ? 'text-blue-600' : 
                          'text-orange-600'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No orders yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="p-4 md:p-6 border-b">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Top Products</h3>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              {topProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl md:text-2xl">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm md:text-base text-gray-800 truncate">{product.title}</div>
                      <div className="text-xs md:text-sm text-gray-500">Stock: {product.stock}</div>
                    </div>
                  </div>
                  <div className="font-bold text-sm md:text-base text-primaryColor ml-2">₹{product.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Registered Users */}
        <div className="bg-white rounded-xl shadow-md border overflow-hidden mb-8">
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">New Registered Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto min-w-[500px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-xs md:text-sm font-medium text-gray-600 p-3 md:p-4">Name</th>
                  <th className="text-xs md:text-sm font-medium text-gray-600 p-3 md:p-4">Email</th>
                  <th className="text-xs md:text-sm font-medium text-gray-600 p-3 md:p-4">Orders</th>
                  <th className="text-xs md:text-sm font-medium text-gray-600 p-3 md:p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-3 md:p-4 text-sm md:text-base font-medium">{user.name}</td>
                      <td className="p-3 md:p-4 text-sm md:text-base text-gray-600">{user.email}</td>
                      <td className="p-3 md:p-4 text-sm md:text-base text-gray-600">{user.orders}</td>
                      <td className="p-3 md:p-4">
                        <span className={`px-2 py-1 rounded text-xs md:text-sm ${
                          user.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
