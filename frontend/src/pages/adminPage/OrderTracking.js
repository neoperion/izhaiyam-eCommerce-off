import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FullpageSpinnerLoader } from '../../components/loaders/spinnerIcon';

const OrderTracking = ({ order, onClose }) => {
  const [carrier, setCarrier] = useState(order?.tracking?.carrier || '');
  const [trackingId, setTrackingId] = useState(order?.tracking?.trackingId || '');
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const handleSaveTracking = async () => {
    if (!carrier || !trackingId.trim()) {
      toast.error("Please select a carrier and enter a tracking ID");
      return;
    }

    setLoading(true);
    const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000/";

    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const header = { headers: { authorization: `Bearer ${LoginToken}` } };

      await axios.put(`${serverUrl}orders/updateTracking/${order.id}`, {
        carrier,
        trackingId: trackingId.trim()
      }, header);

      toast.success("Tracking details updated successfully");
      onClose();
      // Optional: Trigger a refresh of the parent list if possible, or user manually refreshes
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update tracking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden relative">

        {loading && <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center"><FullpageSpinnerLoader /></div>}

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Order Tracking (Admin)</h2>
            <p className="text-xs text-gray-500">Update shipment details for this order</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">

          {/* Customer Reference Section (Read-Only) */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{typeof order.customer === 'object' ? order.customer.name : order.customer || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{order.email || 'N/A'}</span>
              </div>
              {/* Phone is not explicitly in the flattened order object passed to this component from getAllOrders, 
                   but we can display it if available or hide it safely. Based on getAllOrders it might not be there directly 
                   unless we update getAllOrders. For now, we use what we have or placeholder.
                   Wait, getAllOrders in backend DOES NOT select phone. 
                   I will add phone to getAllOrders in backend later. */}
            </div>
          </div>

          {/* Shipment Tracking Section (Editable) */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shipment Tracking</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                >
                  <option value="">Select Carrier</option>
                  <option value="SPEEDEX">Speedex Express</option>
                  <option value="DHL">DHL</option>
                  <option value="SPEEDPOST">India Speed Post</option>
                  <option value="BLUEDART">BlueDart</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID</label>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Tracking ID"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={handleSaveTracking}
            className="flex items-center gap-2 bg-primaryColor text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Save size={16} />
            Save Tracking
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderTracking;
