import React, { useState } from 'react';
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { Card } from '../../components/admin/Card';
import AdminLayout from '../../components/admin/AdminLayout';

export const SupportPage = () => {
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTicket] = useState(null);

  // TODO: Replace with actual backend API call when support ticket endpoints are created
  // Backend needs: POST /api/support/tickets, GET /api/support/tickets, PUT /api/support/tickets/:id
  const tickets = [];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
        <p className="text-gray-500 mt-1">Manage customer support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Open Tickets</p>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
              <p className="text-xs text-gray-500 mt-2">Backend integration needed</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
              <p className="text-xs text-gray-500 mt-2">No active tickets</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Resolved Today</p>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
              <p className="text-xs text-gray-500 mt-2">No resolutions yet</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Critical</p>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
              <p className="text-xs text-gray-500 mt-2">Backend required</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle size={20} className="text-red-600" />
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
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Ticket ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Messages</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Created</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <MessageSquare size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Support Tickets</h3>
                    <p className="text-gray-500 mb-4">Backend support ticket endpoints need to be created.</p>
                    <p className="text-sm text-gray-400">Required endpoints: POST /api/support/tickets, GET /api/support/tickets, PUT /api/support/tickets/:id</p>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{ticket.id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ticket.customer}</p>
                        <p className="text-xs text-gray-500">{ticket.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{ticket.subject}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{ticket.messages}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{ticket.created}</td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium">
                      View
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
};
