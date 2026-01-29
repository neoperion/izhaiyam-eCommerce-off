import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccessModal = ({ isOpen, onClose, onViewOrder }) =>
{
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                >
                    {/* Decorative Top Pattern */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#93a267] to-[#7a8852]" />

                    <div className="p-8 flex flex-col items-center text-center">
                        {/* Success Icon Animation */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-[#93a267]/10 rounded-full flex items-center justify-center mb-6"
                        >
                            <CheckCircle className="w-10 h-10 text-[#93a267]" strokeWidth={3} />
                        </motion.div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                        <p className="text-gray-500 mb-8">
                            Thank you for your purchase. We have received your order and will process it shortly. Check your email for details.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={onViewOrder}
                                className="group flex items-center justify-center gap-2 w-full py-3.5 bg-[#93a267] text-white rounded-xl font-semibold hover:bg-[#7a8852] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                View Your Order
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>

                            <button
                                onClick={onClose}
                                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-50 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OrderSuccessModal;
