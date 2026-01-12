import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../../config';
import AdminLayout from '../../components/admin/AdminLayout';
import { ArrowLeft, Package, User, MapPin, CreditCard } from 'lucide-react';
import { ProductLoader } from '../../components/loaders/productLoader';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const serverUrl = API;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const loginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
            const headers = { headers: { authorization: `Bearer ${loginToken}` } };

            const response = await axios.get(`${serverUrl}/orders/admin/order/${id}`, headers);

            if (response.data.success) {
                setOrder(response.data.order);
            } else {
                setError("Failed to fetch order details");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <AdminLayout><div className="flex justify-center items-center h-screen"><ProductLoader /></div></AdminLayout>;
    
    if (error) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-red-500 font-semibold">{error}</p>
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded-md">Go Back</button>
            </div>
        </AdminLayout>
    );

    if (!order) return null;

    return (
        <AdminLayout>
            <section className="w-full xl:px-[4%] px-[4%] lg:px-[2%] py-6">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
                        <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
                    </div>
                    <div className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold capitalize
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {order.status}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Products Table */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Package size={20} /> Ordered Products
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-medium">
                                        <tr>
                                            <th className="px-4 py-3">Product</th>
                                            <th className="px-4 py-3">Wood Type</th>
                                            <th className="px-4 py-3 text-right">Price</th>
                                            <th className="px-4 py-3 text-center">Qty</th>
                                            <th className="px-4 py-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {order.products.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                                                            {item.selectedColor && (
                                                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                                    <span 
                                                                        className="w-3 h-3 rounded-full inline-block border border-gray-200" 
                                                                        style={{ 
                                                                            background: item.selectedColor?.isDualColor 
                                                                                ? `linear-gradient(90deg, ${item.selectedColor?.primaryHexCode || item.selectedColor?.hexCode} 50%, ${item.selectedColor?.secondaryHexCode} 50%)`
                                                                                : (item.selectedColor?.hexCode || item.selectedColor?.primaryHexCode || '#ccc')
                                                                        }}
                                                                    ></span>
                                                                    {item.selectedColor?.isDualColor 
                                                                        ? `${item.selectedColor?.primaryColorName || 'Color'} + ${item.selectedColor?.secondaryColorName || 'Color'}`
                                                                        : (item.selectedColor?.name || item.selectedColor?.primaryColorName || 'Unknown Color')}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col items-start gap-1">
                                                        {(() => {
                                                            // Resolve Wood Name
                                                            const woodName = item.wood?.type || 
                                                                (typeof item.woodType === 'object' ? item.woodType?.name : item.woodType) || 
                                                                "Not Selected";
                                                            const displayWoodName = woodName === "Not Selected" ? "-" : woodName;

                                                            // Resolve Custom Logic
                                                            const isCustom = item.customization?.enabled || (item.selectedColor && (item.selectedColor.isDualColor || item.selectedColor.name));

                                                            return (
                                                                <>
                                                                    <span className="font-semibold text-gray-800 text-sm capitalize">
                                                                        {displayWoodName}
                                                                    </span>
                                                                    {isCustom && (
                                                                        <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                                                            Custom
                                                                        </span>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}
                                                        
                                                        {/* Price Logic (Only if extra wood cost is tracked separately or for debug, keeping existing logic optionally or hiding if redundant. 
                                                            User said "Price: 12,000" which matches the main column. I will hide explicit extra cost here to clean up UI unless user insists.
                                                            Actually, leaving it out makes it cleaner as per "WHAT ADMIN SHOULD SEE".
                                                        */}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right text-gray-600">
                                                    ₹{item.price.toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-4 py-4 text-center text-gray-900 font-medium">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-4 text-right font-medium text-gray-900">
                                                    ₹{item.lineTotal.toLocaleString('en-IN')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 pt-4 border-t flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                <span className="font-medium text-gray-600">Total Amount</span>
                                <span className="text-xl font-bold text-primaryColor">₹{order.amount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <CreditCard size={20} /> Payment Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-500 block mb-1">Method</span>
                                    <span className="font-medium text-gray-900 capitalize">{order.payment.method}</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-500 block mb-1">Status</span>
                                    <span className={`font-medium capitalize ${order.payment.status === 'paid' ? 'text-green-600' : 'text-gray-900'}`}>{order.payment.status}</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg md:col-span-2">
                                    <span className="text-xs text-gray-500 block mb-1">Transaction ID</span>
                                    <span className="font-mono text-sm text-gray-700">{order.payment.id}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column - User & Address */}
                    <div className="space-y-6">
                        
                        {/* Customer Info */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <User size={20} /> Customer
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs text-gray-500 block">Name</span>
                                    <span className="font-medium text-gray-900">{order.customer.name}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block">Email</span>
                                    <span className="font-medium text-gray-900 break-all">{order.customer.email}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block">Phone</span>
                                    <span className="font-medium text-gray-900">{order.customer.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Address Info */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin size={20} /> Shipping Address
                            </h2>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-600 mb-2 uppercase tracking-wider">
                                    {order.customer.addressType || 'Home'}
                                </span>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {order.customer.addressLine1}<br/>
                                    {order.customer.addressLine2 && <>{order.customer.addressLine2}<br/></>}
                                    {order.customer.city}, {order.customer.state} - <span className="font-semibold">{order.customer.postalCode}</span><br/>
                                    {order.customer.country}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </AdminLayout>
    );
};

export default OrderDetails;
