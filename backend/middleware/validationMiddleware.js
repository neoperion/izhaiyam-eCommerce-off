const Joi = require('joi');
const CustomErrorHandler = require('../errors/customErrorHandler');

const validateRequest = (schema) => (req, res, next) => {
    if (!schema) return next();

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        // We throw a 400 Bad Request
        return next(new CustomErrorHandler(400, errorMessage));
    }

    next();
};

const validateParams = (schema) => (req, res, next) => {
    if (!schema) return next();

    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return next(new CustomErrorHandler(400, errorMessage));
    }
    next();
};

module.exports = { validateRequest, validateParams };
