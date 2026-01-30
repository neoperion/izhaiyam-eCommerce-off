const Joi = require('joi');

const authSchemas = {
    register: Joi.object({
        username: Joi.string().min(3).max(50).required().messages({
            'string.base': 'Username must be a string.',
            'string.empty': 'Username is required.',
            'string.min': 'Username must be at least 3 characters.',
            'any.required': 'Username is required.'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address.',
            'any.required': 'Email is required.'
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters.',
            'any.required': 'Password is required.'
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords do not match.',
            'any.required': 'Confirm Password is required.'
        }),
        phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow('', null).messages({
            'string.pattern.base': 'Phone number must be valid digits (10-15).'
        })
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    resendVerification: Joi.object({
        email: Joi.string().email().required()
    }),

    forgotPassword: Joi.object({
        email: Joi.string().email().required()
    }),

    verifyOtp: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required()
    }),

    resetPassword: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required(),
        newPassword: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
            'any.only': 'Passwords do not match.'
        })
    })
};

module.exports = authSchemas;
