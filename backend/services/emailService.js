const { Resend } = require("resend");

// Initialize Resend with API Key from environment variables
// Fix: Prevent crash if API key is missing
let resend;
if (process.env.RESEND_API_KEY) {
  try {
    resend = new Resend(process.env.RESEND_API_KEY);
  } catch (error) {
    console.warn("⚠️ Failed to initialize Resend:", error.message);
  }
} else {
  console.warn("⚠️ RESEND_API_KEY is missing. Email service will not function.");
}

const FROM_EMAIL = process.env.FROM_EMAIL || "Izhaiyam <orders@izhaiyam.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@izhaiyam.com';

/**
 * Base function to send an email
 * @param {Object} params - { to, subject, html }
 */
async function sendEmail({ to, subject, html }) {
  try {
    if (!resend) {
      console.warn("⚠️ Email skipped: Resend client not initialized.");
      return;
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Email send failed (Resend Error):", error);
      return null;
    }

    console.log(`✅ Email sent to ${to}:`, data.id);
    return data;
  } catch (error) {
    console.error("❌ Email send failed (Exception):", error.message);
  }
}

/**
 * Send OTP for Password Reset
 */
async function sendOtpEmail(email, otp) {
  const html = `
    <h2>Password Reset Request</h2>
    <p>Your OTP to reset password is:</p>
    <h1>${otp}</h1>
    <p>This OTP is valid for 10 minutes.</p>
    <br/>
    <p>If you didn’t request this, ignore this email.</p>
    <p>– Izhaiyam Team</p>
  `;

  await sendEmail({
    to: email,
    subject: "Reset Your Password – Izhaiyam",
    html,
  });
}

/**
 * Send Order Confirmation to Customer
 */
async function sendOrderConfirmationEmail(user, order) {
  const html = `
    <h3>Thanks for your order!</h3>
    <p>Order ID: <b>${order._id}</b></p>
    <p>Total: ₹${order.totalAmount}</p>
    <p>We’ll notify you when it ships.</p>
    <br/>
    <small>Izhaiyam Handloom Furniture</small>
  `;

  await sendEmail({
    to: user.email,
    subject: "Order Confirmed – Izhaiyam",
    html,
  });
}

/**
 * Send New Order Alert to Admin
 */
/**
 * Send New Order Alert to Admin
 */
async function sendAdminNewOrderEmail(user, order) {
  // order._id is often a long Mongo ID or a Date-based ID from frontend (based on user's snippet "order_S4...").
  // If order._id is available, use it.
  
  const html = `
    <p>New order received!</p>
    <p>Order ID: ${order._id}</p>
    <p>Customer: ${user.username || user.email}</p>
    <p>Amount: ₹${order.totalAmount}</p>
  `;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: "New Order Received",
    html,
  });
}

/**
 * Send Payment Success Confirmation to Customer
 */
async function sendPaymentSuccessEmail(user, order, paymentId) {
  const html = `
    <h3>Payment Successful!</h3>
    <p>Order ID: <b>${order._id || order.id}</b></p>
    <p>Amount Paid: ₹${order.totalAmount}</p>
    <p>Payment ID: ${paymentId}</p>
    <br/>
    <small>Izhaiyam Handloom Furniture</small>
  `;

  await sendEmail({
    to: user.email,
    subject: "Payment Successful – Izhaiyam",
    html,
  });
}

/**
 * Send Payment Received Alert to Admin
 */
/**
 * Send Payment Received Alert to Admin
 */
async function sendAdminPaymentReceivedEmail(user, order, paymentId) {
    const html = `
      <p>New order received! (Online Payment)</p>
      <p>Order ID: ${order._id || order.id}</p>
      <p>Customer: ${user.username || user.email}</p>
      <p>Amount: ₹${order.totalAmount}</p>
      <p>Payment ID: ${paymentId}</p>
    `;
  
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: "Payment Received",
      html,
    });
}

/**
 * Send Order Status Update (Shipped / Delivered)
 */
async function sendOrderStatusEmail(user, order, status) {
  // Check trackingUrl vs tracking.trackingUrl based on how controller passes it
  // Controller passes: { _id, tracking: { trackingUrl: ... } }
  // User snippet: order.trackingUrl. 
  // We need to adapt to what the controller passes OR what the template expects.
  // The controller passes `order` object which might be a partial.
  // Let's ensure we handle both structures.
  const trackingUrl = order.tracking?.trackingUrl || order.trackingUrl;

  const html = `
    <p>Your order <b>#${order._id}</b> is now <b>${status}</b>.</p>
    ${
      trackingUrl
        ? `<a href="${trackingUrl}">Track Order</a>`
        : ""
    }
    <br/>
    <small>Izhaiyam Handloom Furniture</small>
  `;

  await sendEmail({
    to: user.email,
    subject: `Order Update – ${status}`,
    html,
  });
}

/**
 * Webhook Management: Create
 */
async function createResendWebhook(url, events = ['email.sent']) {
    try {
        if (!resend) return console.warn("⚠️ Webhook skipped: Resend not initialized.");
        const { data, error } = await resend.webhooks.create({
            endpoint: url,
            events,
        });
        if(error) console.error("Webhook Create Error:", error);
        return data;
    } catch(e) { console.error("Webhook Create Exception:", e); }
}

/**
 * Webhook Management: Retrieve
 */
async function getResendWebhook(id) {
    try {
        if (!resend) return console.warn("⚠️ Webhook skipped: Resend not initialized.");
        const { data, error } = await resend.webhooks.get(id);
        if(error) console.error("Webhook Get Error:", error);
        return data;
    } catch(e) { console.error("Webhook Get Exception:", e); }
}

/**
 * Webhook Management: List
 */
async function listResendWebhooks() {
    try {
        if (!resend) return console.warn("⚠️ Webhook skipped: Resend not initialized.");
        const { data, error } = await resend.webhooks.list();
        if(error) console.error("Webhook List Error:", error);
        return data;
    } catch(e) { console.error("Webhook List Exception:", e); }
}

/**
 * Webhook Management: Update
 */
async function updateResendWebhook(id, url, status = 'enabled', events = ['email.sent']) {
    try {
        if (!resend) return console.warn("⚠️ Webhook skipped: Resend not initialized.");
        const { data, error } = await resend.webhooks.update(id, {
            endpoint: url,
            events,
            status
        });
        if(error) console.error("Webhook Update Error:", error);
        return data;
    } catch(e) { console.error("Webhook Update Exception:", e); }
}

/**
 * Webhook Management: Delete
 */
async function deleteResendWebhook(id) {
    try {
        if (!resend) return console.warn("⚠️ Webhook skipped: Resend not initialized.");
        const { data, error } = await resend.webhooks.remove(id);
        if(error) console.error("Webhook Delete Error:", error);
        return data;
    } catch(e) { console.error("Webhook Delete Exception:", e); }
}

/**
 * Send Contact Form Submission to Admin
 */
async function sendContactFormEmail({ name, email, subject, message }) {
  const html = `
    <h3>New Contact Form Submission</h3>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Subject:</b> ${subject}</p>
    <br/>
    <p><b>Message:</b></p>
    <p>${message.replace(/\n/g, '<br/>')}</p>
    <br/>
    <small>Sent from Izhaiyam Website</small>
  `;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Contact Form: ${subject}`,
    html,
  });
}

module.exports = {
  sendEmail,
  sendOrderConfirmationEmail,
  sendAdminNewOrderEmail,
  sendPaymentSuccessEmail,
  sendAdminPaymentReceivedEmail,
  sendOrderStatusEmail,
  sendOtpEmail,
  sendContactFormEmail,
  // Webhook Management
  createResendWebhook,
  getResendWebhook,
  listResendWebhooks,
  updateResendWebhook,
  deleteResendWebhook
};
