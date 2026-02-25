import React, { useState } from 'react';
import { X, Save, MapPin, Calendar } from 'lucide-react';
import API from '../../config';

const OrderTracking = ({ order, onClose }) => {
  const [carrier, setCarrier] = useState(order?.tracking?.carrier || '');
  const [trackingId, setTrackingId] = useState(order?.tracking?.trackingId || '');
  const [liveLocationUrl, setLiveLocationUrl] = useState(order?.tracking?.liveLocationUrl || '');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(order?.tracking?.expectedDeliveryDate || '');
  const [status, setStatus] = useState(order?.status || 'Pending'); // Added Status State
  const [loading, setLoading] = useState(false);
  const { toastSuccess, toastError } = useToast();

  if (!order) return null;

  const handleSaveTracking = async () => {
    if (!carrier || !trackingId.trim()) {
      toastError("Please select a carrier and enter a tracking ID");
      return;
    }

    setLoading(true);
    const serverUrl = API;

    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || "";
      const header = { headers: { authorization: `Bearer ${LoginToken}` } };

      await axios.put(`${serverUrl}/orders/updateTracking/${order.id}`, {
        carrier,
        trackingId: trackingId.trim(),
        liveLocationUrl: liveLocationUrl.trim(),
        expectedDeliveryDate
      }, header);

      // Also update Order Status if changed
      if (status !== order.status) {
         await axios.put(`${serverUrl}/orders/updateStatus/${order.id}`, { status }, header);
      }

      toastSuccess("Tracking details updated successfully");
      onClose();
      // Optional: Trigger a refresh of the parent list if possible, or user manually refreshes
    } catch (error) {
      toastError(error.response?.data?.message || "Failed to update tracking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">

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

        {/* Modal Content - Scrollable */}
        <div className="p-5 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto">

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

            {/* Order Status Section */}
            <div className="mb-6 pb-6 border-b border-gray-100"> {/* Added mb-6 pb-6 border-b */}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Status</h3>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                   <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent font-medium"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processed">Processed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-shadow"
                >
                  <option value="">Select Carrier</option>
                  <option value="mettur_transports">Mettur Transports</option>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-gray-500"/>
                        Live Location URL (Optional)
                    </div>
                </label>
                <input
                  type="url"
                  value={liveLocationUrl}
                  onChange={(e) => setLiveLocationUrl(e.target.value)}
                  placeholder="Paste Google Maps / live location link"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-500"/>
                        Expected Delivery Date (Optional)
                    </div>
                </label>
                <input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-shadow"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 sm:py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={handleSaveTracking}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primaryColor text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-all text-sm font-medium shadow-sm hover:shadow"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderTracking;
