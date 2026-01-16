const { Webhook } = require('svix');
const CustomErrorHandler = require('../errors/customErrorHandler');

const handleResendWebhook = async (req, res) => {
  try {
    const payload = req.rawBody; // Captured in app.js middleware
    const headers = req.headers;
    const secret = process.env.RESEND_SIGNING_SECRET;

    if (!secret) {
      console.error("❌ RESEND_SIGNING_SECRET is missing.");
      throw new CustomErrorHandler(500, "Webhook secret not configured");
    }
    
    // If rawBody is missing (e.g. middleware issue), fallback safely? 
    // Svix needs raw string. If req.body is object and payload is undefined, we fail.
    if (!payload) {
         throw new CustomErrorHandler(400, "Raw body missing for signature verification");
    }

    const wh = new Webhook(secret);
    let evt;

    try {
      evt = wh.verify(payload, headers);
    } catch (err) {
      console.error("❌ Webhook Signature Verification Failed:", err.message);
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const { type, data } = evt;

    console.log(`🔔 Webhook Received: ${type}`, data ? data.id : '');

    // Handle events
    switch (type) {
      case 'email.sent':
        // Log or update DB
        console.log(`📧 Email Sent: ${data.to} (${data.subject})`);
        break;
      case 'email.delivered':
        console.log(`✅ Email Delivered: ${data.to}`);
        // Potential TODO: Update Order Log or Status if tracking individual emails
        break;
      case 'email.bounced':
        console.error(`⚠️ Email Bounced: ${data.to}`);
        // Potential TODO: Flag user account or notify Admin
        break;
      case 'email.complained':
        console.error(`🚫 Email Complaint: ${data.to}`);
        break;
      default:
        console.log(`ℹ️ Unhandled Webhook Event: ${type}`);
    }

    res.status(200).json({ success: true, message: "Webhook processed" });

  } catch (error) {
    // If CustomErrorHandler is thrown, middleware handles it, but for webhooks we want explicit 200/400/500
    // so Resend doesn't retry indefinitely on 500s if it's our logic error.
    // Actually, sending 500 causes retry, which is good for temporary failures.
    // Sending 200/400 stops retry.
    // We'll let global handler catch 500s via 'throw'.
    if (error instanceof CustomErrorHandler) throw error;
    
    // For Svix errors caught manually above, we handled them.
    // For others:
    console.error("Webhook Error:", error);
    throw new CustomErrorHandler(500, error.message);
  }
};

module.exports = { handleResendWebhook };
