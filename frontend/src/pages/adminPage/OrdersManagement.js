import React, { useState, useEffect } from 'react';
import { Eye, Truck, Search, Filter, Download } from 'lucide-react';
import OrderTracking from './OrderTracking';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

const OrdersManagement = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTracking, setShowTracking] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch real orders data from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const loginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { headers: { authorization: `Bearer ${loginToken}` } };
      
      const response = await axios.get(`${serverUrl}/orders/all`, headers);
      
      if (response.data.success) {
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = orders;

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setShowTracking(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'In Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'Pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (    <AdminLayout>    <section className="w-full xl:px-[4%] px-[4%] lg:px-[2%]">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Orders Management</h2>
            <p className="text-sm text-gray-500 mt-1">Track and manage customer orders</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm md:text-base">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm md:text-base"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor appearance-none bg-white text-sm md:text-base min-w-[150px]"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Customer</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Product</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Amount</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Date</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 md:p-4 font-semibold text-sm md:text-base text-gray-800">{order.id}</td>
                      <td className="p-3 md:p-4 text-sm md:text-base text-gray-700">{order.customer}</td>
                      <td className="p-3 md:p-4 text-sm md:text-base text-gray-700">
                        {order.product}
                        {order.productCount > 1 && (
                          <span className="text-xs text-gray-500 ml-1">+{order.productCount - 1} more</span>
                        )}
                      </td>
                      <td className="p-3 md:p-4 font-semibold text-sm md:text-base text-primaryColor">₹{order.amount.toLocaleString("en-IN")}</td>
                      <td className="p-3 md:p-4">
                        <span className={`px-2 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 text-sm md:text-base text-gray-600">{order.date}</td>
                      <td className="p-3 md:p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTrackOrder(order)}
                            className="p-2 bg-primaryColor text-white rounded-lg hover:opacity-90 transition-opacity"
                            title="Track Order"
                          >
                            <Truck size={16} />
                          </button>
                          <button
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No orders found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md border p-4">
            <p className="text-xs md:text-sm text-gray-500">Total Orders</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md border p-4">
            <p className="text-xs md:text-sm text-gray-500">Delivered</p>
            <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">
              {orders.filter(o => o.status === 'Delivered').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md border p-4">
            <p className="text-xs md:text-sm text-gray-500">In Transit</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">
              {orders.filter(o => o.status === 'In Transit').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md border p-4">
            <p className="text-xs md:text-sm text-gray-500">Total Revenue</p>
            <p className="text-xl md:text-2xl font-bold text-primaryColor mt-1">
              ₹{orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Order Tracking Modal */}
      {showTracking && (
        <OrderTracking
          order={selectedOrder}
          onClose={() => {
            setShowTracking(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </section>
    </AdminLayout>
  );
};

export default OrdersManagement;
