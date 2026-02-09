const Joi = require('joi');

// Shared sub-schemas
const productItemSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    image: Joi.string().optional(),
    wood: Joi.object().optional().allow(null),
    selectedColor: Joi.object().optional().allow(null),
    // Allow other snapshot fields
}).unknown(true);

const orderDetailsSchema = Joi.object({
    products: Joi.array().items(productItemSchema).min(1).required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(), // Stricter validation if needed
    addressType: Joi.string().valid('Home', 'Office', 'Other').default('Home'),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional().allow(''),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required(),
    shippingMethod: Joi.string().optional(), // 'Standard', 'Express', etc.
    totalAmount: Joi.number().positive().required(),
    saveAddress: Joi.boolean().optional(),
    // Allow status fields which might be passed but usually ignored/overridden by backend
    deliveryStatus: Joi.string().optional(),
    paymentStatus: Joi.string().optional()
}).unknown(true); // Allow unknown for now in case of minor frontend drifts

const orderSchemas = {
    authOrder: Joi.object({
        orderDetails: orderDetailsSchema.required()
    }),

    createRazorpay: Joi.object({
        amount: Joi.number().positive().required(),
        products: Joi.array().items(
            Joi.object({
                productId: Joi.string().required(),
                quantity: Joi.number().min(1).required()
            }).unknown(true)
        ).required()
    }),

    verifyPayment: Joi.object({
        razorpay_order_id: Joi.string().required(),
        razorpay_payment_id: Joi.string().required(),
        razorpay_signature: Joi.string().required(),
        orderDetails: orderDetailsSchema.required()
    }),

    updateTracking: Joi.object({
        carrier: Joi.string().required(),
        trackingId: Joi.string().required(),
        liveLocationUrl: Joi.string().uri().optional().allow(null, ''),
        expectedDeliveryDate: Joi.date().optional().allow(null, '')
    }),

    updateStatus: Joi.object({
        status: Joi.string().valid('Pending', 'Shipped', 'Delivered', 'Cancelled', 'Processed', 'pending', 'shipped', 'delivered', 'cancelled', 'processed').required()
    }),

    updateUserStatus: Joi.object({
        verificationStatus: Joi.string().valid('pending', 'verified').required()
    })
};

module.exports = orderSchemas;
