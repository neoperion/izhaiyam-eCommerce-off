import { useState } from 'react';
import { AddressModal } from './AddressModal';
import { FaHome, FaBriefcase, FaEdit, FaTrash } from 'react-icons/fa';

export const Adresses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const handleSaveAddress = (addressData) => {
    const newAddress = {
      id: Date.now(),
      ...addressData

    };
    setSavedAddresses([...savedAddresses, newAddress]);
    setIsModalOpen(false);
  };

  const handleDeleteAddress = (id) => {
    setSavedAddresses(savedAddresses.filter(addr => addr.id !== id));
  };

  return (
    <div className="w-[100%] tablet:px-[6%] mb-20 xl:px-[4%] px-[4%] lg:px-[2%]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-inter text-xl md:text-2xl font-semibold text-gray-900">Saved Addresses</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 md:px-6 py-2 md:py-3 bg-[#93a267] hover:bg-[#7d8c56] text-white font-inter font-medium text-xs md:text-base rounded-lg transition-all flex items-center gap-1 md:gap-2"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add New Address</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {savedAddresses.length === 0 ? (
        /* Empty State */
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-inter text-xl font-semibold text-gray-900 mb-2">No Saved Addresses</h3>
          <p className="font-inter text-gray-600 mb-6">Add your first address to make checkout faster</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-[#93a267] hover:bg-[#7d8c56] text-white font-inter font-medium rounded-lg transition-all inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Address
          </button>
        </div>
      ) : (
        /* Address Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedAddresses.map((address) => (
            <div
              key={address.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#93a267] hover:shadow-lg transition-all"
            >
              {/* Address Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {address.addressType === 'Home' ? (
                    <div className="w-10 h-10 rounded-full bg-[#93a267]/10 flex items-center justify-center">
                      <FaHome className="w-5 h-5 text-[#93a267]" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaBriefcase className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <span className="font-inter font-semibold text-gray-900">{address.addressType}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Address"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-2">
                <p className="font-inter text-gray-900 font-medium">{address.addressLine1}</p>
                {address.addressLine2 && (
                  <p className="font-inter text-gray-600 text-sm">{address.addressLine2}</p>
                )}
                <p className="font-inter text-gray-600 text-sm">
                  {address.city}, {address.state}
                </p>
                <p className="font-inter text-gray-600 text-sm">
                  {address.country} - {address.postalCode}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="font-inter text-xs text-gray-500">
                  Pincode: {address.postalCode}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAddress}
      />
    </div>
  );
};
