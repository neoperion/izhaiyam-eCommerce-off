import React from 'react';
import { X, Eye, Mail, MapPin, Package } from 'lucide-react';

const ViewUserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">User Details</h2>
            <p className="text-sm text-gray-500 mt-1">View complete user information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mail size={20} className="text-blue-600" />
                <h3 className="font-semibold text-gray-800">Contact Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p className="font-medium text-gray-800">{user.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium text-gray-800">{user.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <p className="font-medium text-gray-800">{user.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Package size={20} className="text-green-600" />
                <h3 className="font-semibold text-gray-800">Order Statistics</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Total Orders:</span>
                  <p className="font-medium text-gray-800">{user.orders}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Spent:</span>
                  <p className="font-medium text-green-600">₹{user.spent.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Member Since:</span>
                  <p className="font-medium text-gray-800">{user.joined}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={20} className="text-purple-600" />
              <h3 className="font-semibold text-gray-800">Address Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Address:</span>
                <p className="font-medium text-gray-800">{user.address || 'Not provided'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">City:</span>
                  <p className="font-medium text-gray-800">{user.city || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Country:</span>
                  <p className="font-medium text-gray-800">{user.country || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Account Status</h3>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {user.status}
              </span>
              {user.adminStatus && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
