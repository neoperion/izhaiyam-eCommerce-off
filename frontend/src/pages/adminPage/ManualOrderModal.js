import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineClose, AiOutlinePlus, AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai';
import { useToast } from '../../context/ToastContext';
import API from '../../config';

const ManualOrderModal = ({ onClose, onOrderCreated }) => {
    const { toastSuccess, toastError } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Customer State
    const [customer, setCustomer] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentStatus: 'pending',
        deliveryStatus: 'processed'
    });

    // Product State
    const [products, setProducts] = useState([]); // All available products
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]); // Cart for manual order
    
    // Fetch Products on Mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${API}/api/v1/products`);
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.error("Failed to load products");
            }
        };
        fetchProducts();
    }, []);

    const handleCustomerChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const addToCart = (product) => {
        const existing = selectedItems.find(item => item.productId === product._id);
        if (existing) {
            toastError("Product already added. Adjust quantity below.");
            return;
        }
        setSelectedItems([...selectedItems, {
            productId: product._id,
            name: product.title,
            price: product.price,
            quantity: 1,
            image: product.image,
            maxStock: product.stock
        }]);
        setSearchTerm(''); // Clear search to show added
    };

    const updateQuantity = (id, qty) => {
        const updated = selectedItems.map(item => {
            if (item.productId === id) {
                 if (qty > item.maxStock) {
                     toastError(`Only ${item.maxStock} available`);
                     return item;
                 }
                 return { ...item, quantity: Math.max(1, qty) };
            }
            return item;
        });
        setSelectedItems(updated);
    };

    const updatePrice = (id, newPrice) => {
        const updated = selectedItems.map(item => {
            if (item.productId === id) {
                 return { ...item, price: newPrice };
            }
            return item;
        });
        setSelectedItems(updated);
    };

    const removeItem = (id) => {
        setSelectedItems(selectedItems.filter(i => i.productId !== id));
    };

    const calculateTotal = () => {
        return selectedItems.reduce((sum, item) => sum + (parseFloat(item.price || 0) * item.quantity), 0);
    };

    const handleSubmit = async () => {
        if (!customer.name || !customer.phone || !customer.address) {
            toastError("Please fill required customer details (Name, Phone, Address)");
            return;
        }
        if (selectedItems.length === 0) {
            toastError("Please add at least one product");
            return;
        }

        setLoading(true);
        try {
            const serverUrl = API;
            const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken;

            const payload = {
                customerDetails: customer,
                products: selectedItems.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    price: i.price // Sending price incase backend wants it
                })),
                paymentStatus: customer.paymentStatus,
                deliveryStatus: customer.deliveryStatus
            };

            const { data } = await axios.post(`${serverUrl}/orders/admin/manual-order`, payload, {
                headers: { authorization: `Bearer ${LoginToken}` }
            });

            if (data.success) {
                toastSuccess("Order created successfully!");
                onOrderCreated(); // Refresh parent
                onClose();
            }
        } catch (error) {
            toastError(error.response?.data?.message || "Failed to create order");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Products
    const filteredProducts = products.filter(p => 
        (p.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
        (p.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Create Manual Order</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <AiOutlineClose className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Steps */}
                <div className="flex border-b border-gray-100">
                    <button 
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${step === 1 ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setStep(1)}
                    >
                        1. Customer Details
                    </button>
                    <button 
                         className={`flex-1 py-3 text-sm font-medium transition-colors ${step === 2 ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setStep(2)}
                    >
                        2. Add Products
                    </button>
                    <button 
                         className={`flex-1 py-3 text-sm font-medium transition-colors ${step === 3 ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setStep(3)}
                    >
                        3. Review & Submit
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                                <input name="name" value={customer.name} onChange={handleCustomerChange} className="w-full p-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="John Doe" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <input name="phone" value={customer.phone} onChange={handleCustomerChange} className="w-full p-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="9876543210" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                                <input name="email" value={customer.email} onChange={handleCustomerChange} className="w-full p-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="john@example.com" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                <textarea name="address" value={customer.address} onChange={handleCustomerChange} className="w-full p-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="Full delivery address" rows="3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input name="city" value={customer.city} onChange={handleCustomerChange} className="w-full p-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                <input name="pincode" value={customer.pincode} onChange={handleCustomerChange} className="w-full p-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                             {/* Search */}
                            <div className="mb-4 relative">
                                <AiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search products by name or category..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>

                            {/* Results */}
                            {searchTerm && (
                                <div className="max-h-60 overflow-y-auto mb-6 bg-white rounded-lg border shadow-sm">
                                    {filteredProducts.slice(0, 10).map(product => (
                                        <div key={product._id} className="flex items-center justify-between p-3 hover:bg-emerald-50 border-b last:border-0 cursor-pointer" onClick={() => addToCart(product)}>
                                            <div className="flex items-center gap-3">
                                                <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />
                                                <div>
                                                    <p className="font-medium text-gray-800">{product.title}</p>
                                                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-emerald-600">₹{product.price}</span>
                                                <button className="p-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200">
                                                    <AiOutlinePlus />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredProducts.length === 0 && <p className="p-4 text-center text-gray-500">No products found</p>}
                                </div>
                            )}

                            {/* Custom Item Section */}
                            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
                                <h4 className="text-sm font-bold text-gray-700 mb-2">Can't find it? Add Custom Item</h4>
                                <div className="flex flex-wrap gap-2">
                                    <input 
                                        id="customName"
                                        placeholder="Item Name" 
                                        className="flex-1 p-2 border rounded text-sm"
                                    />
                                    <input 
                                        id="customPrice"
                                        type="number" 
                                        placeholder="Price" 
                                        className="w-24 p-2 border rounded text-sm"
                                    />
                                    <input 
                                        id="customQty"
                                        type="number" 
                                        defaultValue="1"
                                        className="w-16 p-2 border rounded text-sm text-center"
                                    />
                                    <button 
                                        onClick={() => {
                                            const name = document.getElementById('customName').value;
                                            const price = document.getElementById('customPrice').value;
                                            const qty = document.getElementById('customQty').value;
                                            if(!name || !price) return toastError("Name and Price required");
                                            
                                            setSelectedItems([...selectedItems, {
                                                productId: `custom_${Date.now()}`,
                                                name: name,
                                                price: price,
                                                quantity: parseInt(qty) || 1,
                                                image: "https://placehold.co/150x150?text=Custom",
                                                maxStock: 9999,
                                                isCustom: true
                                            }]);
                                            
                                            // Reset fields
                                            document.getElementById('customName').value = "";
                                            document.getElementById('customPrice').value = "";
                                            document.getElementById('customQty').value = "1";
                                        }}
                                        className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900"
                                    >
                                        Add Custom
                                    </button>
                                </div>
                            </div>

                            {/* Selected Items */}
                            <h3 className="font-bold text-gray-800 mb-3">Selected Items ({selectedItems.length})</h3>
                            <div className="space-y-3">
                                {selectedItems.map(item => (
                                    <div key={item.productId} className="flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <img src={item.image} alt="" className="w-12 h-12 rounded object-cover" />
                                            <div>
                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-gray-500 text-sm">₹</span>
                                                    <input 
                                                        type="number" 
                                                        value={item.price} 
                                                        onChange={(e) => updatePrice(item.productId, e.target.value)}
                                                        className="w-20 p-1 border rounded text-sm"
                                                        placeholder="Price"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center">
                                                <span className="text-gray-400 text-xs mr-2">Qty:</span>
                                                <input 
                                                    type="number" 
                                                    min="1" 
                                                    max={item.maxStock}
                                                    value={item.quantity} 
                                                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                                                    className="w-16 p-1 border rounded text-center"
                                                />
                                            </div>
                                            <button onClick={() => removeItem(item.productId)} className="text-red-500 hover:text-red-700 p-1">
                                                <AiOutlineDelete className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {selectedItems.length === 0 && <p className="text-gray-400 italic text-sm">No items added yet. Search above.</p>}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            {/* Summary Card */}
                            <div className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                                <h3 className="font-bold text-gray-800 border-b pb-2">Order Summary</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Customer</p>
                                        <p className="font-medium">{customer.name}</p>
                                        <p className="text-gray-400">{customer.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Deliver To</p>
                                        <p className="font-medium truncate">{customer.address}, {customer.city}</p>
                                    </div>
                                </div>
                                <div className="pt-2 border-t">
                                     <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Total Amount</span>
                                        <span className="text-emerald-600">₹{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Settings */}
                             <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
                                <h3 className="font-bold text-gray-800">Order Settings</h3>
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                                        <select 
                                            name="paymentStatus" 
                                            value={customer.paymentStatus} 
                                            onChange={handleCustomerChange}
                                            className="w-full p-2 border rounded focus:ring-emerald-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Status</label>
                                        <select 
                                            name="deliveryStatus" 
                                            value={customer.deliveryStatus} 
                                            onChange={handleCustomerChange}
                                            className="w-full p-2 border rounded focus:ring-emerald-500"
                                        >
                                            <option value="processed">Processed</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
                    {step > 1 ? (
                        <button onClick={() => setStep(step - 1)} className="text-gray-600 hover:text-gray-800 px-4 py-2">
                            Back
                        </button>
                    ) : <div></div>}

                    {step < 3 ? (
                        <button 
                            onClick={() => setStep(step + 1)} 
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Next
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit} 
                            disabled={loading}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
                            Create Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManualOrderModal;
