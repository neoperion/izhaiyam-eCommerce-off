const { sendContactFormEmail } = require("../services/emailService");

const submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    await sendContactFormEmail({ name, email, subject, message });
    res.status(200).json({ msg: "Message sent successfully" });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ msg: "Failed to send message" });
  }
};

module.exports = { submitContactForm };
