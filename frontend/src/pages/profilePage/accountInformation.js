import { ArrowRight, User, Calendar, ShoppingBag, DollarSign, Shield } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const AccountInformation = () => {
  const { userData } = useSelector((state) => state.userAuth);
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'text-sage-600' },
    { label: 'Year Joined', value: '2022', icon: Calendar, color: 'text-sage-600' },
    { label: 'Total Spent', value: '₹0', icon: DollarSign, color: 'text-sage-600' },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Admin Access Card */}
      {userData.adminStatus && (
        <div className="bg-gradient-to-r from-sage-600 to-sage-700 rounded-xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5" />
                <h3 className="font-semibold">Administrator Access</h3>
              </div>
              <p className="text-cream-100 text-sm">Manage products, orders, and site settings</p>
            </div>
            <button
              onClick={() => navigate("/administrator/product-management")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-white text-sage-700 rounded-lg font-semibold hover:bg-cream-50 transition-all"
            >
              Admin Panel
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-sage-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sage-600 text-xs md:text-sm font-medium">{stat.label}</span>
                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl md:text-3xl font-playfair font-bold text-sage-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-xl p-4 md:p-6 lg:p-8 shadow-sm border border-sage-200">
        <h3 className="text-lg md:text-xl font-playfair font-bold text-sage-900 mb-4 md:mb-6">Personal Information</h3>
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-3 md:pb-4 border-b border-sage-100">
            <div className="flex items-center gap-2 min-w-[100px] sm:min-w-[120px]">
              <User className="w-4 h-4 text-sage-600" />
              <h4 className="font-semibold text-sage-700 text-sm md:text-base">Username</h4>
            </div>
            <span className="text-sage-900 text-sm md:text-base break-all">{userData.username}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-3 md:pb-4 border-b border-sage-100">
            <div className="flex items-center gap-2 min-w-[100px] sm:min-w-[120px]">
              <svg className="w-4 h-4 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h4 className="font-semibold text-sage-700 text-sm md:text-base">Email</h4>
            </div>
            <span className="text-sage-900 text-sm md:text-base break-all">{userData.email}</span>
          </div>
        </div>
      </div>

      {/* Account Metrics Card */}
      <div className="bg-white rounded-xl p-4 md:p-6 lg:p-8 shadow-sm border border-sage-200">
        <h3 className="text-lg md:text-xl font-playfair font-bold text-sage-900 mb-4 md:mb-6">Customer Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
          <div className="p-3 md:p-4 bg-sage-50 rounded-lg border border-sage-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-sage-600" />
              <h4 className="font-medium text-sage-700 text-xs md:text-sm">Member Since</h4>
            </div>
            <p className="text-xl md:text-2xl font-playfair font-bold text-sage-900">2022</p>
          </div>
          <div className="p-3 md:p-4 bg-sage-50 rounded-lg border border-sage-100">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-sage-600" />
              <h4 className="font-medium text-sage-700 text-xs md:text-sm">Complete Purchases</h4>
            </div>
            <p className="text-xl md:text-2xl font-playfair font-bold text-sage-900">0</p>
          </div>
          <div className="p-3 md:p-4 bg-sage-50 rounded-lg border border-sage-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-sage-600" />
              <h4 className="font-medium text-sage-700 text-xs md:text-sm">Total Value</h4>
            </div>
            <p className="text-xl md:text-2xl font-playfair font-bold text-sage-900">₹0</p>
          </div>
          <div className="p-3 md:p-4 bg-sage-50 rounded-lg border border-sage-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h4 className="font-medium text-sage-700 text-xs md:text-sm">Account Status</h4>
            </div>
            <p className="text-xl md:text-2xl font-playfair font-bold text-sage-900">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};
