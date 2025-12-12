import React, { useState } from 'react';
import { X, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';

const OrderTracking = ({ order, onClose }) => {
  if (!order) return null;

  const trackingSteps = [
    {
      status: 'Order Placed',
      date: order.date || '12 Dec, 2025',
      time: '10:30 AM',
      completed: true,
      icon: Package,
      description: 'Your order has been placed successfully'
    },
    {
      status: 'Processing',
      date: '12 Dec, 2025',
      time: '11:45 AM',
      completed: order.status !== 'Pending',
      icon: Clock,
      description: 'Order is being prepared for shipment'
    },
    {
      status: 'In Transit',
      date: '13 Dec, 2025',
      time: '9:15 AM',
      completed: order.status === 'In Transit' || order.status === 'Delivered',
      icon: Truck,
      description: 'Package is on the way to destination'
    },
    {
      status: 'Delivered',
      date: order.status === 'Delivered' ? '14 Dec, 2025' : '',
      time: order.status === 'Delivered' ? '2:30 PM' : '',
      completed: order.status === 'Delivered',
      icon: CheckCircle,
      description: 'Package delivered successfully'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Order Tracking</h2>
            <p className="text-sm text-gray-500 mt-1">Track your order status in real-time</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Order Info */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="font-semibold text-gray-800">{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Customer</p>
              <p className="font-semibold text-gray-800">{order.customer}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Amount</p>
              <p className="font-semibold text-primaryColor">₹{order.amount?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="px-6 py-8">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Steps */}
            <div className="space-y-8">
              {trackingSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        step.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3
                          className={`text-base md:text-lg font-semibold ${
                            step.completed ? 'text-gray-800' : 'text-gray-400'
                          }`}
                        >
                          {step.status}
                        </h3>
                        {step.date && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={14} />
                            <span>{step.date} • {step.time}</span>
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          step.completed ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
          <div className="bg-white rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Product</span>
              <span className="font-medium text-gray-800">{order.product}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Status</span>
              <span className="font-medium text-green-600">Paid</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Status</span>
              <span className="font-medium text-primaryColor">{order.status}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-primaryColor text-white rounded-lg hover:opacity-90 transition-opacity text-sm md:text-base">
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
