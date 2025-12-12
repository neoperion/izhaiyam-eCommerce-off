import React, { useState, useEffect } from "react";
import { Eye, Edit, Search, Filter, UserPlus, Trash2, X, Check, AlertCircle } from 'lucide-react';
import axios from "axios";
import AdminLayout from '../../components/admin/AdminLayout';

export const UserManagement = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    adminStatus: false,
    verificationStatus: 'pending'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const loginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { headers: { authorization: `Bearer ${loginToken}` } };
      
      const response = await axios.get(`${serverUrl}/orders/users`, headers);
      
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showMessage('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // View user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Open edit modal
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      adminStatus: user.adminStatus || false,
      verificationStatus: user.status === 'Verified' ? 'verified' : 'pending'
    });
    setShowEditModal(true);
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (!editForm.name || !editForm.email) {
      showMessage('error', 'Name and email are required');
      return;
    }

    try {
      setActionLoading(true);
      const loginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { headers: { authorization: `Bearer ${loginToken}` } };

      const response = await axios.patch(
        `${serverUrl}/orders/users/${selectedUser.id}`,
        {
          name: editForm.name,
          email: editForm.email,
          adminStatus: editForm.adminStatus,
          verificationStatus: editForm.verificationStatus
        },
        headers
      );

      if (response.data.success) {
        showMessage('success', 'User updated successfully');
        setShowEditModal(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showMessage('error', error.response?.data?.msg || 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  // Update verification status
  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Verified' ? 'pending' : 'verified';
    
    try {
      const loginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { headers: { authorization: `Bearer ${loginToken}` } };

      const response = await axios.patch(
        `${serverUrl}/orders/users/${userId}/status`,
        { verificationStatus: newStatus },
        headers
      );

      if (response.data.success) {
        showMessage('success', `User status changed to ${newStatus}`);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showMessage('error', error.response?.data?.msg || 'Failed to update status');
    }
  };

  // Delete user
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      setActionLoading(true);
      const loginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const headers = { headers: { authorization: `Bearer ${loginToken}` } };

      const response = await axios.delete(
        `${serverUrl}/orders/users/${selectedUser.id}`,
        headers
      );

      if (response.data.success) {
        showMessage('success', 'User deleted successfully');
        setShowDeleteModal(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showMessage('error', error.response?.data?.msg || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = users;

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, statusFilter, users]);

  return (    <AdminLayout>    <section className="w-full xl:px-[4%] px-[4%] lg:px-[2%]">
      <div className="container mx-auto">
        {/* Success/Error Message */}
        {message.text && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Users Management</h2>
            <p className="text-sm text-gray-500 mt-1">View and manage customer accounts</p>
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
                placeholder="Search by name or email..."
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
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Name</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Email</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Orders</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Total Spent</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Joined</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 md:p-4 text-sm md:text-base font-medium text-gray-800">
                        {user.name}
                        {user.adminStatus && (
                          <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Admin</span>
                        )}
                      </td>
                      <td className="p-3 md:p-4 text-sm md:text-base text-gray-700">{user.email}</td>
                      <td className="p-3 md:p-4 text-sm md:text-base text-gray-600">{user.orders}</td>
                      <td className="p-3 md:p-4 font-semibold text-sm md:text-base text-primaryColor">₹{user.spent.toLocaleString()}</td>
                      <td className="p-3 md:p-4">
                        <button
                          onClick={() => handleStatusChange(user.id, user.status)}
                          className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium cursor-pointer transition-all hover:scale-105 ${
                            user.status === 'Verified' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                          title={`Click to change to ${user.status === 'Verified' ? 'Pending' : 'Verified'}`}
                        >
                          {user.status}
                        </button>
                      </td>
                      <td className="p-3 md:p-4 text-sm md:text-base text-gray-600">{user.joined}</td>
                      <td className="p-3 md:p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No users found matching your criteria
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
            <p className="text-xs md:text-sm text-gray-500">Total Users</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md border p-4">
            <p className="text-xs md:text-sm text-gray-500">Verified Users</p>
            <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">
              {users.filter(u => u.status === 'Verified').length}

        {/* View User Modal */}
        {showViewModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">User Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-semibold text-gray-800">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-semibold text-gray-800">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Admin Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.adminStatus ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedUser.adminStatus ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <p className="font-semibold text-gray-800">{selectedUser.orders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                    <p className="font-semibold text-primaryColor">₹{selectedUser.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Joined Date</p>
                    <p className="font-semibold text-gray-800">{selectedUser.joined}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">User ID</p>
                    <p className="font-mono text-sm text-gray-600">{selectedUser.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Edit User</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Status
                  </label>
                  <select
                    value={editForm.verificationStatus}
                    onChange={(e) => setEditForm({ ...editForm, verificationStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="adminStatus"
                    checked={editForm.adminStatus}
                    onChange={(e) => setEditForm({ ...editForm, adminStatus: e.target.checked })}
                    className="w-4 h-4 text-primaryColor border-gray-300 rounded focus:ring-primaryColor"
                  />
                  <label htmlFor="adminStatus" className="text-sm font-medium text-gray-700">
                    Grant Admin Privileges
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-primaryColor text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {actionLoading ? 'Updating...' : 'Update User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete User</h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={confirmDeleteUser}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {actionLoading ? 'Deleting...' : 'Delete User'}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md border p-4">
            <p className="text-xs md:text-sm text-gray-500">Pending Users</p>
            <p className="text-xl md:text-2xl font-bold text-yellow-600 mt-1">
              {users.filter(u => u.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md border p-4">
            <p className="text-xs md:text-sm text-gray-500">Admin Users</p>
            <p className="text-xl md:text-2xl font-bold text-purple-600 mt-1">
              {users.filter(u => u.adminStatus).length}
            </p>
          </div>
        </div>
      </div>
    </section>
    </AdminLayout>
  );
};
