import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Copy, Tag, Calendar, Percent, TrendingUp } from 'lucide-react';
import { Card } from '../../components/admin/Card';
import AdminLayout from '../../components/admin/AdminLayout';

export const CouponsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // TODO: Replace with actual backend API call when coupon endpoints are created
  // Backend needs: POST /api/coupons, GET /api/coupons, PUT /api/coupons/:id, DELETE /api/coupons/:id
  const coupons = [];

  const getDaysRemaining = (expiryDate) => {
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons & Discounts</h1>
          <p className="text-gray-500 mt-1">Create and manage promotional codes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} />
          Create Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Coupons</p>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
              <p className="text-xs text-gray-500 mt-2">No coupons created</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Tag size={20} className="text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Usage</p>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
              <p className="text-xs text-gray-500 mt-2">Awaiting backend integration</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenue Impact</p>
              <h3 className="text-2xl font-bold text-gray-900">₹1.9L</h3>
              <p className="text-xs text-purple-600 mt-2">From coupon sales</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Percent size={20} className="text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
              <h3 className="text-2xl font-bold text-gray-900">3</h3>
              <p className="text-xs text-orange-600 mt-2">Within 7 days</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar size={20} className="text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
      </Card>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {coupons.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Tag size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Coupons Yet</h3>
                <p className="text-gray-500 mb-6">Backend coupon management endpoints need to be created.</p>
                <p className="text-sm text-gray-400">Required endpoints: POST /api/coupons, GET /api/coupons, PUT /api/coupons/:id, DELETE /api/coupons/:id</p>
              </div>
            </Card>
          </div>
        ) : (
          coupons.map((coupon) => (
          <Card key={coupon.id} hover className="relative overflow-hidden">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                coupon.status === 'Active' ? 'bg-green-100 text-green-700' :
                coupon.status === 'Expired' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {coupon.status}
              </span>
            </div>

            {/* Coupon Code */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <Tag size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-mono">{coupon.code}</h3>
                  <p className="text-sm text-gray-500">
                    {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Usage</span>
                <span className="text-sm font-semibold text-gray-900">
                  {coupon.usage} / {coupon.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all"
                  style={{ width: `${(coupon.usage / coupon.limit) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                <p className="text-sm font-semibold text-gray-900">{coupon.expiry}</p>
                {coupon.status === 'Active' && (
                  <p className="text-xs text-orange-600 mt-1">
                    {getDaysRemaining(coupon.expiry)} days left
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Revenue Generated</p>
                <p className="text-sm font-semibold text-emerald-600">₹{coupon.revenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium">
                <Copy size={16} />
                Copy Code
              </button>
              <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                <Edit size={16} className="text-blue-600" />
              </button>
              <button className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          </Card>
          ))
        )}
      </div>

      {/* Create Coupon Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Coupon</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Coupon creation form would go here...</p>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Create Coupon
              </button>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
};
