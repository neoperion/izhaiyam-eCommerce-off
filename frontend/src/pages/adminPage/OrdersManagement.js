import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlineDownload, AiOutlineFilter, AiOutlinePlus } from "react-icons/ai";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import API from "../../config";
import AdminLayout from '../../components/admin/AdminLayout';
import OrderTracking from './OrderTracking';
import ManualOrderModal from './ManualOrderModal';

import { PaginationSectionForProductsAdminPage } from "./productTab/paginationForProductsAdmin";


export const SingleOrderTableCell = ({ order, serialNo, fetchOrders, onOrderDeleted }) => {
  const navigate = useNavigate();
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [fullOrderDetails, setFullOrderDetails] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const { toastSuccess, toastError, toastInfo } = useToast();

  const { id, customer, product, amount, paymentMethod, status, date, orderSource } = order;

  const categories = order.orderItems 
      ? [...new Set(order.orderItems.map(item => item.category || 'Others'))].join(', ')
      : 'Others';

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-green-400">Delivered</span>;
      case "Shipped":
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-blue-400">Shipped</span>;
      case "Processing":
      case "Processed":
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-yellow-400">Processed</span>;
      case "Cancelled":
        return <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-red-400">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-400">{status}</span>;
    }
  };

  const getSourceBadge = (source) => {
      if (source === 'offline') {
          return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded border border-purple-400">Offline</span>;
      }
      return <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200">Online</span>;
  };

  const deleteOrder = async (id) => {
      if(!window.confirm("Are you sure you want to delete this order?")) return;
      try {
          const serverUrl = API;
          const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || "";
          await axios.delete(`${serverUrl}/orders/admin/order/${id}`, {
             headers: { authorization: `Bearer ${LoginToken}` }
          });
          toastSuccess("Order deleted successfully");
          if(onOrderDeleted) onOrderDeleted(id);
          else fetchOrders(); 
      } catch (error) {
          toastError("Failed to delete order");
      }
  }


  const exportSingleOrder = async (id) => {
      try {
          const serverUrl = API;
          const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || "";
          toastInfo("Exporting order...");
          const response = await axios.get(`${serverUrl}/orders/export/order/${id}`, {
             headers: { authorization: `Bearer ${LoginToken}` },
             responseType: 'blob'
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `order_${id}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          toastSuccess("Order exported successfully");
      } catch (error) {
          toastError("Failed to export order");
          console.error(error);
      }
  }

  const handleTrackingClick = async () => {
      setLoadingTracking(true);
      try {
          const serverUrl = API;
          const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || "";
          const { data } = await axios.get(`${serverUrl}/orders/admin/order/${id}`, {
             headers: { authorization: `Bearer ${LoginToken}` }
          });
          if(data.success) {
              setFullOrderDetails(data.order);
              setIsTrackingModalOpen(true);
          }
      } catch (error) {
          toastError("Failed to load order details");
          console.error(error);
      } finally {
          setLoadingTracking(false);
      }
  }

  return (
    <>
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4 text-black font-inter border-b border-gray-200">{serialNo}</td>
      <td className="p-4 text-black border-b border-gray-200 text-sm">
          {id}
          <div className="mt-1">{getSourceBadge(orderSource)}</div>
      </td>
      <td className="p-4 text-black border-b border-gray-200">{customer || "Guest"}</td>
      <td className="p-4 text-black border-b border-gray-200 max-w-xs truncate" title={product}>
          {product}
      </td>
      <td className="p-4 text-black border-b border-gray-200 font-medium text-xs text-gray-600 uppercase">
          {categories}
      </td>
      <td className="p-4 text-black border-b border-gray-200 font-medium whitespace-nowrap">₹ {amount}</td>
      <td className="p-4 text-black border-b border-gray-200">{paymentMethod}</td>
      <td className="p-4 text-black border-b border-gray-200">
        {getStatusBadge(status)}
      </td>
      <td className="p-4 text-black border-b border-gray-200 whitespace-nowrap text-sm">
          {date}
      </td>
      <td className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <AiOutlineEye
            onClick={() => navigate(`/admin/orders-management/${id}`)}
            className="w-6 h-6 md:w-5 md:h-5 shrink-0 cursor-pointer hover:fill-blue-600 fill-gray-600 transition-colors"
            title="View Details"
          />
          <AiOutlineEdit
            onClick={handleTrackingClick}
            className={`w-6 h-6 md:w-5 md:h-5 shrink-0 cursor-pointer hover:fill-yellow-600 fill-gray-600 transition-colors ${loadingTracking ? 'opacity-50' : ''}`}
             title="Update Status / Tracking"
          />
           <AiOutlineDelete
            onClick={() => deleteOrder(id)}
            className="w-6 h-6 md:w-5 md:h-5 shrink-0 cursor-pointer hover:fill-red-600 fill-gray-600 transition-colors"
             title="Delete Order"
          />
           <AiOutlineDownload
            onClick={() => exportSingleOrder(id)}
            className="w-6 h-6 md:w-5 md:h-5 shrink-0 cursor-pointer hover:fill-green-600 fill-gray-600 transition-colors"
             title="Export Excel"
          />
        </div>
        {isTrackingModalOpen && fullOrderDetails && (
            <OrderTracking 
                order={fullOrderDetails} 
                onClose={() => {
                    setIsTrackingModalOpen(false);
                    fetchOrders(); 
                }} 
            />
        )}
      </td>
    </tr>
    </>
  );
};


const OrdersManagement = () => {
  const serverUrl = API;
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [ordersParams, setOrdersParams] = useState({
    orders: [],
    ordersLength: 0,
    pageNo: 1,
    perPage: 10,
    isError: false,
    filterStatus: 'All', 
  });
  const [loading, setLoading] = useState(false);
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);

  const { orders, ordersLength, pageNo, perPage, isError } = ordersParams;

  const handleOrderDelete = (deletedId) => {
      setOrdersParams(prev => ({
          ...prev,
          orders: prev.orders.filter(order => order.id !== deletedId),
          ordersLength: prev.ordersLength - 1
      }));
  };

  useEffect(() => {
    fetchOrders(ordersParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const exportOrders = async (range) => {
    setShowExportDropdown(false);
    try {
        const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
        const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || "";
        
        toastInfo(`Exporting ${range} orders...`);
        
        const response = await axios.get(`${serverUrl}/orders/export/${range}`, {
           headers: { authorization: `Bearer ${LoginToken}` },
           responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `orders_${range}_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toastSuccess("Orders exported successfully");
    } catch (error) {
        toastError("Failed to export orders");
        console.error(error);
    }
  };
  const fetchOrders = async (currentParams) => {
    setLoading(true);
    try {
        const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || "";
        // Assuming backend supports pagination ?page=1&limit=10 or distinct endpoints
        // Based on `Dashboard.js` logic which uses `/api/v1/allOrders` (which might not be paginated?)
        // Let's assume standard structure. If not paginated, we paginate client side or use default.
        // Checking `Dashboard.js`... it calls `${serverUrl}/api/v1/allOrders`.
        // Let's try to mimic `products/sortByLowStockProducts` pattern if `allOrders` accepts query params.
        
        // REVISIT: The user said "without any backend change". 
        // If the backend `/api/v1/admin/orders` or similar doesn't exist or support pagination, we might fetch all and slice.
        // Let's check `backend/controllers/Orders.js` if possible using `read_file`? 
        // No, I'll stick to what I know. `Orders.js` is open. 
        // Assuming `api/v1/admin/orders` supports it or I use `api/v1/orders/me` equivalent.
        // Actually, let's use the endpoint found in `adminPage/OrdersManagement.js` (if I could see it).
        // Since it was missing, I'll bet on `/api/v1/admin/orders`. If that fails, I'll adjust.
        
      // Verified: app.js mounts ordersRoute at "/orders"
      // Verified: routes/ordersRoute.js has router.route("/all").get(...)
      // Correct URL: /orders/all
      const { data } = await axios.get(`${serverUrl}/orders/all`, {
         headers: { authorization: `Bearer ${LoginToken}` }
      });
      
      let allOrders = data.orders || [];
      
      // Filter Logic - Client Side (Status)
      if (currentParams.filterStatus && currentParams.filterStatus !== 'All') {
          const filterLower = currentParams.filterStatus.toLowerCase();
          allOrders = allOrders.filter(order => {
              const statusLower = (order.status || '').toLowerCase();
              return statusLower === filterLower;
          });
      }
      
      const totalOrders = allOrders.length;
      
      // Client-side slice for pagination
      const indexOfLastOrder = currentParams.pageNo * currentParams.perPage;
      const indexOfFirstOrder = indexOfLastOrder - currentParams.perPage;
      const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);

      setOrdersParams(prev => ({
          ...prev,
          ordersLength: totalOrders,
          orders: currentOrders.map(order => ({
              id: order.id, // Transformed by getAllOrders already
              customer: order.customer,
              product: order.product,
              orderItems: order.orderItems,
              amount: order.amount,
              paymentMethod: order.paymentMethod,
              status: order.status,
              orderSource: order.orderSource || 'online',
              date: order.date
          }))
      }));
      setLoading(false);

    } catch (error) {
        // Fallback or Error
        console.error(error);
        setOrdersParams(prev => ({ ...prev, isError: true }));
        setLoading(false);
    }
  };


  return (
    <AdminLayout>
      <section className="w-[100%] xl:px-[4%] tablet:px-[6%] px-[4%] lg:px-[2%]">
        <div className="my-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-black text-xl md:text-2xl font-medium">Orders Management</h2>
            
            <div className="flex gap-4"> {/* Wrapper for Buttons */}
            
            {/* Manual Order Button */}
             <button 
                onClick={() => setIsManualOrderModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 transition-colors"
            >
                <AiOutlinePlus className="w-5 h-5" />
                Add Manual Order
            </button>

            {/* Filter Dropdown */}
            <div>
                 <div className="relative">
                   <select
                        value={ordersParams.filterStatus}
                        onChange={(e) => {
                            const newStatus = e.target.value;
                            setOrdersParams(prev => ({ ...prev, filterStatus: newStatus, pageNo: 1 })); // Reset page to 1 on filter change
                            fetchOrders({ ...ordersParams, filterStatus: newStatus, pageNo: 1 });
                        }}
                        className="appearance-none flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:border-gray-400 transition cursor-pointer pr-8 focus:outline-none focus:ring-2 focus:ring-primaryColor"
                   >
                        <option value="All">All Orders</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                   </select>
                   <AiOutlineFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                 </div>
            </div>

            <div className="relative">
                <button 
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                >
                    <AiOutlineDownload className="w-5 h-5" />
                    Export
                </button>
                
                {showExportDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                        <ul className="py-1 text-gray-700">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => exportOrders('all')}>Export All Orders</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => exportOrders('today')}>Export Today</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => exportOrders('week')}>Export This Week</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => exportOrders('month')}>Export This Month</li>
                        </ul>
                    </div>
                )}
            </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto min-w-[1000px]">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-sm font-medium text-gray-700 p-4">S.No</th>
                    <th className="text-sm font-medium text-gray-700 p-4">Order ID</th>
                    <th className="text-sm font-medium text-gray-700 p-4">Source</th>
                    <th className="text-sm font-medium text-gray-700 p-4">Customer Name</th>
                    <th className="text-sm font-medium text-gray-700 p-4">Product(s)</th>
                    <th className="text-sm font-medium text-gray-700 p-4">Category</th>
                    <th className="text-sm font-medium text-gray-700 p-4">Amount</th>
                    <th className="text-sm font-medium text-gray-700 p-4">Payment Method</th>
                    <th className="text-sm font-medium text-gray-700 p-4">Order Status</th>
                    <th className="text-sm font-medium text-gray-700 p-4">Created Date</th>
                    <th className="text-sm font-medium text-gray-700 p-4">Actions</th>
                  </tr>
                </thead>
                
                {loading ? (
                    <tbody>
                        <tr><td colSpan="9" className="p-8 text-center text-gray-500">Loading orders...</td></tr>
                    </tbody>
                ) : ordersLength > 0 ? (
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order, index) => {
                            const serialNo = (pageNo - 1) * perPage + index + 1;
                            return (
                                <SingleOrderTableCell 
                                    key={order.id} 
                                    order={order} 
                                    serialNo={serialNo} 
                                    fetchOrders={() => fetchOrders(ordersParams)} 
                                    onOrderDeleted={handleOrderDelete}
                                />
                            );
                        })}
                    </tbody>
                ) : (
                    <tbody>
                         <tr>
                            <td colSpan="9" className="p-8 text-center text-gray-500">
                                {isError ? "Error fetching orders." : "No orders found."}
                            </td>
                         </tr>
                    </tbody>
                )}
              </table>
            </div>
          </div>

          {ordersLength > 0 && (
            <PaginationSectionForProductsAdminPage
              productsLength={ordersLength}
              asyncFnParamState={ordersParams}
              asyncFn={fetchOrders}
              setAsyncFnParamState={setOrdersParams}
            />
          )}

        </div>
      </section>
      
      {isManualOrderModalOpen && (
          <ManualOrderModal 
              onClose={() => setIsManualOrderModalOpen(false)}
              onOrderCreated={() => fetchOrders(ordersParams)}
          />
      )}

    </AdminLayout>
  );
};

export default OrdersManagement;
