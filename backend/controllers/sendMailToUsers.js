const nodemailer = require("nodemailer");
const CustomErrorHandler = require("../errors/customErrorHandler");

//checking this so as to know what to fill in the nodemailern host key
const checkEmailHost = (email) => {
  let host;

  const provider = email.split("@")[1];

  switch (provider) {
    case "gmail.com":
      host = "smtp.gmail.com";
      break;
    // case "yahoo.com":
    //   host = "smtp.mail.yahoo.com";
    //   break;
    // case "outlook.com":
    //   host = "smtp-mail.outlook.com";
    //   break;
    // case "zoho.com":
    //   host = "smtp.zoho.com";
    //   break;
    // case "aol.com":
    //   host = "smtp.aol.com";
    //   break;
    default:
      host = null;
  }

  return host;
};

const sendMessageToUserEmail = async (email, verificationToken, messageData) => {
  const { port, html, pass, secure, text, subject, user } = messageData(verificationToken);

  // Check if email credentials are configured
  if (!user || !pass || user === 'noreply@example.com' || pass === 'dummy_password_replace_this') {
    console.warn('⚠️  Email credentials not configured. Skipping email send.');
    console.log(`📧 Would have sent email to: ${email}`);
    console.log(`🔗 Verification token: ${verificationToken}`);
    return { success: false, message: 'Email not configured' };
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: user,
        pass: pass,
      },
    });

    await transporter.sendMail({
      from: "Auffur" + " <" + user + ">",
      to: email,
      subject: subject,
      text: text,
      html: html,
    });

    console.log(`✅ Email sent successfully to: ${email}`);
    return { success: true };
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    // Don't throw error, just log it
    return { success: false, message: err.message };
  }
};

module.exports = { checkEmailHost, sendMessageToUserEmail };
