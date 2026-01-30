import { useState, useEffect } from 'react';
import { AddressModal } from './AddressModal';
import { FaHome, FaBriefcase, FaTrash, FaCheckCircle, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { useToast } from "../../context/ToastContext";
import API from "../../config";

export const Adresses = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toastSuccess, toastError } = useToast();

    const serverUrl = API;

    const getAuthToken = () => {
        const userData = localStorage.getItem("UserData");
        if (userData) {
            try {
                const parsed = JSON.parse(userData);
                return parsed.loginToken;
            } catch (e) {
                return null;
            }
        }
        return null;
    };

    const fetchAddresses = async () => {
        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await axios.get(`${serverUrl}/api/v1/address`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setSavedAddresses(response.data.addresses);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
            // Don't toast on load error to avoid spam if auth fails silently
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSaveAddress = async (addressData) => {
        const token = getAuthToken();
        if (!token) {
            toastError("Please login to add an address");
            return;
        }

        try {
            const response = await axios.post(`${serverUrl}/api/v1/address/add`, addressData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSavedAddresses(response.data.addresses);
                setIsModalOpen(false);
                toastSuccess("Address added successfully");
            }
        } catch (error) {
            toastError(error.response?.data?.msg || "Failed to add address");
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;

        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await axios.delete(`${serverUrl}/api/v1/address/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSavedAddresses(response.data.addresses);
                toastSuccess("Address deleted successfully");
            }
        } catch (error) {
            toastError(error.response?.data?.msg || "Failed to delete address");
        }
    };

    const handleSetDefault = async (id) => {
        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await axios.put(`${serverUrl}/api/v1/address/setDefault/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSavedAddresses(response.data.addresses);
                toastSuccess("Default address updated");
            }
        } catch (error) {
            toastError(error.response?.data?.msg || "Failed to set default address");
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center font-inter text-gray-500">Loading addresses...</div>;
    }

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
                            key={address._id}
                            className={`bg-white border-2 rounded-xl p-6 transition-all relative group ${address.isDefault ? 'border-[#93a267] shadow-md' : 'border-gray-200 hover:border-[#93a267] hover:shadow-lg'}`}
                        >
                             {/* Default Badge */}
                             {address.isDefault && (
                                <div className="absolute top-4 right-4 bg-[#93a267] text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <FaStar className="w-3 h-3" /> Default
                                </div>
                            )}

                            {/* Address Type Badge */}
                            <div className="flex items-center justify-between mb-4 mt-2">
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
                            </div>

                            {/* Address Details */}
                            <div className="space-y-2 mb-4 min-h-[100px]">
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

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between gap-2">
                                {!address.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(address._id)}
                                        className="text-xs font-medium text-gray-500 hover:text-[#93a267] transition-colors"
                                    >
                                        Set as Default
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => handleDeleteAddress(address._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                                    title="Delete Address"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
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
