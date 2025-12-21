import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, LogOut, Package, MapPin, Heart, HelpCircle, Wallet, Eye, EyeOff, Search, Plus, Trash2, User, Menu, X } from 'lucide-react';
import { toast } from "react-toastify";
import { isTokenValidBeforeHeadingToRoute } from "../../utils/isTokenValidBeforeHeadingToARoute";
import { FullpageSpinnerLoader } from "../../components/loaders/spinnerIcon";
import FooterSection from "../../components/footerSection";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isTokenValidLoader, userData } = useSelector((state) => state.userAuth);

  const [activeTab, setActiveTab] = useState('myProfile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });

  // check if user is authorized to view the page
  useEffect(() => {
    isTokenValidBeforeHeadingToRoute(dispatch, navigate);
  }, [dispatch, navigate]);

  // Initialize form data from userData
  useEffect(() => {
    if (userData) {
      const names = userData.username?.split(' ') || ['', ''];
      setFormData({
        firstName: names[0] || '',
        lastName: names[1] || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = () => {
    toast("Profile updated successfully!", {
      type: "success",
      autoClose: 3000,
      position: "top-center",
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset form data to original userData
    if (userData) {
      const names = userData.username?.split(' ') || ['', ''];
      setFormData({
        firstName: names[0] || '',
        lastName: names[1] || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
    }
    setIsEditing(false);
  };
// ... (skip unchanged lines) ...
                      <div>
                        <label className="font-inter block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`font-inter w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#93a267] ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          placeholder="Phone Number"
                        />
                        {!userData.phone && (
                          <p className="text-xs text-[#93a267] mt-1 font-medium">
                            Add phone number to enable phone login
                          </p>
                        )}
                      </div>

  const handleUpdatePassword = () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      toast("Passwords do not match!", {
        type: "error",
        autoClose: 3000,
        position: "top-center",
      });
      return;
    }
    toast("Password updated successfully!", {
      type: "success",
      autoClose: 3000,
      position: "top-center",
    });
    setPasswordData({ password: '', confirmPassword: '' });
  };

  const logoutBtnClick = async () => {
    try {
      await localStorage.clear("userData");
      toast("User has successfully logged out", {
        type: "success",
        autoClose: 3000,
        position: "top-center",
      });
      navigate("/login");
    } catch (error) {
      toast("Something went wrong", {
        type: "error",
        autoClose: 3000,
        position: "top-center",
      });
    }
  };

  const getInitials = () => {
    if (userData?.username) {
      const names = userData.username.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return userData.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const menuItems = [
    { id: 'myProfile', label: 'My Profile', icon: User },
    { id: 'myOrders', label: 'My Orders', icon: Package },
    { id: 'addressBook', label: 'Address Book', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'helpDesk', label: 'Help Desk', icon: HelpCircle },
  ];

  if (isTokenValidLoader) {
    return <FullpageSpinnerLoader />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 mt-12">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 max-w-7xl mx-auto px-4 lg:px-0">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 p-4 mb-4 rounded-lg shadow-sm sticky top-12 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#93a267] to-[#7d8c56] text-white flex items-center justify-center text-sm font-inter font-bold">
                  {getInitials()}
                </div>
                <div>
                  <h3 className="font-inter font-semibold text-gray-900 text-sm">{userData?.username || 'User'}</h3>
                  <p className="font-inter text-xs text-gray-600">
                    {activeTab === 'myProfile' && 'My Profile'}
                    {activeTab === 'myOrders' && 'My Orders'}
                    {activeTab === 'addressBook' && 'Address Book'}
                    {activeTab === 'wishlist' && 'Wishlist'}
                    {activeTab === 'helpDesk' && 'Help Desk'}
                  </p>
                </div>
              </div>
              <button
                onClick={logoutBtnClick}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar - Desktop only */}
          <aside className="hidden lg:block w-80 bg-white min-h-screen sticky top-12 pt-6 pb-6 shadow-sm">
            {/* User Profile Section */}
            <div className="px-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#93a267] to-[#7d8c56] text-white flex items-center justify-center text-xl font-inter font-bold">
                  {getInitials()}
                </div>
                <div>
                  <h3 className="font-inter font-semibold text-gray-900">{userData?.username || 'User'}</h3>
                  <button
                    onClick={() => {
                      setActiveTab('myProfile');
                      setIsEditing(true);
                    }}
                    className="font-inter text-xs text-gray-600 hover:text-[#93a267] flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Account
                  </button>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1 px-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`font-inter w-full flex items-center gap-3 px-4 py-3 rounded transition-all ${activeTab === item.id
                      ? 'bg-[#93a267]/10 text-[#93a267] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="px-6 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={logoutBtnClick}
                className="font-inter w-full py-2 border-2 border-[#93a267] text-[#93a267] rounded-full font-semibold hover:bg-[#93a267]/5 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 pb-6 lg:pb-12 w-full lg:w-auto">
            {/* Mobile Navigation Tabs */}
            <div className="lg:hidden mb-6 grid grid-cols-2 gap-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`font-inter flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-lg transition-all shadow-sm ${activeTab === item.id
                      ? 'bg-[#93a267] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#93a267]'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Header */}
            <div className="bg-white p-4 lg:p-6 mb-6 rounded-lg shadow-sm">
              <h1 className="font-inter text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {activeTab === 'myProfile' && 'My Profile'}
                {activeTab === 'myOrders' && 'My Orders'}
                {activeTab === 'addressBook' && 'Address Book'}
                {activeTab === 'wishlist' && 'Wishlist'}
                {activeTab === 'helpDesk' && 'Help Desk'}
              </h1>
              <p className="font-inter text-gray-600 text-sm">
                {activeTab === 'myProfile' && 'Edit Your Account Details'}
                {activeTab === 'myOrders' && 'Track Your Order, Check Details & More'}
                {activeTab === 'addressBook' && 'Save Or Change Your Address'}
                {activeTab === 'wishlist' && 'Your Saved Items'}
                {activeTab === 'helpDesk' && 'Get Help & Support'}
              </p>
            </div>

            {/* My Profile Tab */}
            {activeTab === 'myProfile' && (
              <div className="bg-white rounded-lg p-8 shadow-sm">
                {/* Personal Information */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-inter text-2xl font-bold text-gray-900">Personal Information</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-inter block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`font-inter w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#93a267] ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <label className="font-inter block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`font-inter w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#93a267] ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-inter block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`font-inter w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#93a267] ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          placeholder="Email"
                        />
                      </div>
                      <div>
                        <label className="font-inter block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`font-inter w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#93a267] ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          placeholder="Phone Number"
                        />
                         {!userData.phone && (
                          <p className="text-xs text-[#93a267] mt-1 font-medium">
                            Add phone number to enable phone login
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="font-inter mt-6 px-8 py-2 bg-[#93a267] text-white font-semibold rounded hover:bg-[#7d8c56] transition-all flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Account
                    </button>
                  ) : (
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={handleUpdateProfile}
                        className="font-inter px-8 py-2 bg-[#93a267] text-white font-semibold rounded hover:bg-[#7d8c56] transition-all"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="font-inter px-8 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* My Orders Tab */}
            {/* My Orders Tab */}
            {activeTab === 'myOrders' && (
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex justify-end mb-6">
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="font-inter w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#93a267]"
                    />
                    <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {userData?.orders && userData.orders.length > 0 ? (
                  <div className="space-y-6">
                    {/* Sort orders by date (newest first) and map */}
                    {[...userData.orders]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((order) => (
                      <div key={order._id || Math.random()} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                          <div className="flex gap-6">
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Order Placed</p>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Total</p>
                              <p className="text-sm font-medium text-gray-900">₹{order.totalAmount?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase mb-1">Order ID</p>
                              <p className="text-sm font-medium text-gray-900">#{order._id?.slice(-8).toUpperCase() || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                             {/* Display Tracking Details if Order is Shipped */}
                             {order.tracking && order.tracking.trackingId && (
                                <div className="text-right mb-1">
                                  <p className="text-xs text-gray-500">Carrier: <span className="font-medium text-gray-800">{order.tracking.carrier}</span></p>
                                  <p className="text-xs text-gray-500">Tracking ID: <span className="font-medium text-gray-800 select-all">{order.tracking.trackingId}</span></p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">Note: Paste this ID on the courier page if required</p>
                                </div>
                             )}

                             <div className="flex gap-3">
                               {order.tracking && order.tracking.trackingUrl && (
                                 <button
                                   onClick={() => window.open(order.tracking.trackingUrl, "_blank", "noopener")}
                                   className="px-4 py-2 border border-[#93a267] text-[#93a267] rounded-lg text-sm font-medium hover:bg-[#93a267] hover:text-white transition-colors"
                                 >
                                   Track Order
                                 </button>
                               )}
                               <div className={`px-4 py-2 rounded-full text-xs font-semibold
                                ${order.deliveryStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.deliveryStatus === 'shipped' || order.deliveryStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'}`}>
                                {order.deliveryStatus?.charAt(0).toUpperCase() + order.deliveryStatus?.slice(1) || 'Pending'}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          {order.products.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 py-4 border-b last:border-0 border-gray-100">
                              <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                                {item.productId?.image ? (
                                   <img src={item.productId.image} alt="Product" className="w-full h-full object-cover" />
                                ) : (
                                   <Package className="w-8 h-8 text-gray-400 m-auto mt-4" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 line-clamp-1">{item.productId?.title || 'Product Name Unavailable'}</h4>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-24 h-24 border-4 border-[#93a267] rounded-lg flex items-center justify-center mb-6">
                      <Package className="w-12 h-12 text-[#93a267]" />
                    </div>
                    <h3 className="font-inter text-2xl font-bold text-gray-900 mb-2">You have no orders!</h3>
                    <p className="font-inter text-gray-600 mb-8">There are no recent orders to show</p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="font-inter px-8 py-3 bg-[#93a267] text-white font-semibold rounded hover:bg-[#7d8c56] transition-all"
                    >
                      START SHOPPING
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Address Book Tab */}
            {activeTab === 'addressBook' && (
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex justify-end mb-6">
                  <button className="font-inter px-6 py-2 bg-[#93a267] text-white font-semibold rounded hover:bg-[#7d8c56] transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Address
                  </button>
                </div>
                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="font-inter text-gray-600 text-lg">No address found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-inter font-semibold text-gray-900">{addr.type}</h4>
                          <button className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-inter text-gray-700 text-sm mb-2">{addr.street}</p>
                        <p className="font-inter text-gray-600 text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="font-inter text-gray-600 text-lg">No items in your wishlist</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="font-inter mt-6 px-8 py-3 bg-[#93a267] text-white font-semibold rounded hover:bg-[#7d8c56] transition-all"
                  >
                    BROWSE PRODUCTS
                  </button>
                </div>
              </div>
            )}

            {/* Help Desk Tab */}
            {activeTab === 'helpDesk' && (
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-[#93a267] mx-auto mb-4" />
                  <h3 className="font-inter text-2xl font-bold text-gray-900 mb-2">Help & Support Center</h3>
                  <p className="font-inter text-gray-600 mb-8">Need assistance? We're here to help!</p>
                  <button
                    onClick={() => navigate('/contact')}
                    className="font-inter px-8 py-3 bg-[#93a267] text-white font-semibold rounded hover:bg-[#7d8c56] transition-all"
                  >
                    CONTACT US
                  </button>
                </div>
              </div>
            )}

            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-[#93a267] mx-auto mb-4" />
                  <h3 className="font-inter text-2xl font-bold text-gray-900 mb-2">Your Wallet</h3>
                  <p className="font-inter text-gray-600 mb-4">Current Balance</p>
                  <p className="font-inter text-4xl font-bold text-[#93a267] mb-8">₹0.00</p>
                  <p className="font-inter text-sm text-gray-500">No transactions yet</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <FooterSection />
    </>
  );
};
