
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
  let formattedTo = to;
  try {
    if (!to) {
        console.warn("Skipping SMS: No recipient number provided.");
        return;
    }

    // Format phone number to E.164 (Add +91 if missing)
    formattedTo = to.toString().trim();
    
    // Remove spaces, dashes, parentheses
    formattedTo = formattedTo.replace(/[\s\-()]/g, '');

    // If 10 digits, add +91 (India)
    if (/^\d{10}$/.test(formattedTo)) {
        formattedTo = `+91${formattedTo}`;
    } else if (!formattedTo.startsWith("+")) {
       // If it looks like it has a country code but no +, add +
       // Only add + if it's not empty
       if (formattedTo.length > 0) {
           formattedTo = `+${formattedTo}`;
       }
    }

    console.log(`Attempting to send SMS to Raw: '${to}', Formatted: '${formattedTo}'`);

    const result = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedTo,
      body: message
    });
    
    console.log(`SMS sent successfully to ${formattedTo}. SID: ${result.sid}`);
  } catch (error) {
    console.error(`Failed to send SMS to Raw: '${to}', Formatted: '${formattedTo}'. Error Code: ${error.code}, Message: ${error.message}`);
    // Suppress error to not break the main flow
  }
};

module.exports = { sendSMS };
