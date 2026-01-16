require('dotenv').config();
const { sendEmail } = require('./services/emailService');

async function test() {
    console.log("Testing Resend Email Service...");
    const key = process.env.RESEND_API_KEY;
    if(!key) {
        console.error("❌ RESEND_API_KEY is missing in .env");
        console.log("Please set RESEND_API_KEY=re_... in your .env file or environment variables.");
        return;
    }

    console.log("Using API Key:", key.substring(0, 5) + "...");

    const result = await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@izhaiyam.com',
        subject: "Test Email from Izhaiyam Backend",
        html: "<h1>It Works!</h1><p>This is a test email from the Resend integration.</p>"
    });

    if(result) {
        console.log("✅ Test Email Sent! ID:", result.id);
    } else {
        console.log("❌ Test Email Failed (Check logs above)");
    }
}

test();
