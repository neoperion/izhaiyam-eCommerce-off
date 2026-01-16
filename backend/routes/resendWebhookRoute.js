const express = require('express');
const router = express.Router();
const { handleResendWebhook } = require('../controllers/resendWebhookController');

router.post('/', handleResendWebhook);

module.exports = router;
