import React, { useState } from 'react';
import { FaHome, FaBriefcase, FaTimes } from 'react-icons/fa';

const statesOfIndia = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
];

export const AddressModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        addressType: 'Home',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: 'India',
        postalCode: '',
        isDefault: false
    });

    const [isLoadingPincode, setIsLoadingPincode] = useState(false);
    const [pincodeError, setPincodeError] = useState('');

    // Fetch location details by pincode
    const fetchLocationByPincode = async (pincode) => {
        if (pincode.length !== 6) {
            setPincodeError('');
            return;
        }

        setIsLoadingPincode(true);
        setPincodeError('');

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
                const location = data[0].PostOffice[0];
                setFormData(prev => ({
                    ...prev,
                    city: location.Name || location.District || '',
                    state: location.State || ''
                }));
                setPincodeError('');
            } else {
                setPincodeError('Invalid pincode');
                setFormData(prev => ({
                    ...prev,
                    city: '',
                    state: ''
                }));
            }
        } catch (error) {
            console.error('Error fetching pincode data:', error);
            setPincodeError('Failed to fetch location');
        } finally {
            setIsLoadingPincode(false);
        }
    };

    const handlePincodeChange = (e) => {
        const pincode = e.target.value;
        setFormData({ ...formData, postalCode: pincode });

        if (pincode.length === 6) {
            fetchLocationByPincode(pincode);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Address form data:', formData);

        // Call the onSave callback to save the address
        if (onSave) {
            onSave(formData);
        }

        // Reset form
        setFormData({
            addressType: 'Home',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            country: 'India',
            postalCode: '',
            isDefault: false
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="font-inter text-2xl font-semibold text-gray-900">Add New Address</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaTimes className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Address Type */}
                    <div className="mb-6">
                        <label className="font-inter block text-sm font-medium text-gray-700 mb-3">Address Type</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border-2 transition-all ${formData.addressType === 'Home'
                                    ? 'border-[#93a267] bg-[#93a267]/10 text-[#93a267]'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                                onClick={() => setFormData({ ...formData, addressType: 'Home' })}
                            >
                                <FaHome className="w-4 h-4" />
                                <span className="font-inter font-medium">Home</span>
                            </button>
                            <button
                                type="button"
                                className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border-2 transition-all ${formData.addressType === 'Office'
                                    ? 'border-[#93a267] bg-[#93a267]/10 text-[#93a267]'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                                onClick={() => setFormData({ ...formData, addressType: 'Office' })}
                            >
                                <FaBriefcase className="w-4 h-4" />
                                <span className="font-inter font-medium">Office</span>
                            </button>
                        </div>
                    </div>

                    {/* Address Line 1 */}
                    <div className="mb-5">
                        <label htmlFor="addressLine1" className="font-inter block text-sm font-medium text-gray-700 mb-2">
                            Address Line 1 (House / Flat / Street)
                        </label>
                        <input
                            type="text"
                            id="addressLine1"
                            required
                            className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
                            placeholder="Enter house number, street name"
                            value={formData.addressLine1}
                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                        />
                    </div>

                    {/* Address Line 2 */}
                    <div className="mb-5">
                        <label htmlFor="addressLine2" className="font-inter block text-sm font-medium text-gray-700 mb-2">
                            Address Line 2 <span className="text-gray-400">(Optional – Landmark / Area)</span>
                        </label>
                        <input
                            type="text"
                            id="addressLine2"
                            className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
                            placeholder="Landmark or nearby area"
                            value={formData.addressLine2}
                            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                        />
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label htmlFor="city" className="font-inter block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                required
                                className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
                                placeholder="Enter city name"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="state" className="font-inter block text-sm font-medium text-gray-700 mb-2">
                                State
                            </label>
                            <select
                                id="state"
                                required
                                className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            >
                                <option value="">Select State</option>
                                {statesOfIndia.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Pincode and Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label htmlFor="pincode" className="font-inter block text-sm font-medium text-gray-700 mb-2">
                                Pincode / ZIP Code
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="pincode"
                                    required
                                    maxLength={6}
                                    className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
                                    placeholder="6 digit pincode"
                                    value={formData.postalCode}
                                    onChange={handlePincodeChange}
                                />
                                {isLoadingPincode && (
                                    <div className="absolute right-3 top-3">
                                        <div className="w-6 h-6 border-2 border-[#93a267] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            {pincodeError ? (
                                <p className="font-inter text-xs text-red-500 mt-1.5">{pincodeError}</p>
                            ) : (
                                <p className="font-inter text-xs text-gray-500 mt-1.5">
                                    {formData.postalCode.length === 6 && !isLoadingPincode && formData.city
                                        ? '✓ Location auto-filled'
                                        : 'Enter pincode to auto-fill city & state'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="country" className="font-inter block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <select
                                id="country"
                                className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
                                required
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            >
                                <option value="India">India</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-inter font-medium rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-12 px-6 bg-[#93a267] hover:bg-[#7d8c56] text-white font-inter font-semibold rounded-lg transition-all"
                        >
                            Save Address
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
