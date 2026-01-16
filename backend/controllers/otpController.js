const User = require("../models/userData");
const { sendOtpEmail } = require("../services/emailService");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../errors/customErrorHandler");

/**
 * Generate 6 digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Request OTP (Forgot Password)
 */
const forgotPassword = async (req, res) => {
  const email = req.body?.email?.toLowerCase();

  if (!email) {
    throw new CustomErrorHandler(400, "Please provide your email address");
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Security: Do not reveal if user exists. Fake success message.
    console.log(`[Forgot Password] Email not found: ${email}`);
    return res.status(200).json({ message: "If your email is registered, you will receive an OTP shortly." });
  }

  const otp = generateOTP();
  user.resetOtp = otp;
  user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send Email (Handle dev/prod mode for admin email vs user email if needed, 
  // currently treating as production ready logic where we send to user.email, 
  // relying on emailService to handle any 'Free Mode' restrictions if applicable, 
  // OR explicitly following user request to use ADMIN_EMAIL in dev mode if they want override)
  
  // User Rule: "DEV MODE (NOW) to: process.env.ADMIN_EMAIL"
  // PROD MODE (LATER) to: user.email
  // We will check a flag or just follow the rule.
  // Since we just switched to verified domain, we can try sending to user.email.
  // BUT the user prompt said "DEV MODE (NOW) ... to admin email".
  // However, we successfully verified domain in previous step.
  // Let's use user.email because we are in "Production Mode". 
  // If we revert to free mode, emailService handles it? No, emailService logic was: 
  // "FROM_EMAIL = orders@izhaiyam.com".
  // The RESTRICTION in free mode was we can only send TO verified email.
  // Since we verified domain, we can send to anyone.
  // So we use user.email.
  
  // Determine recipient based on EMAIL_MODE
  // DEV: Send to ADMIN_EMAIL (Safe testing)
  // PROD: Send to user.email (Live)
  const recipient = process.env.EMAIL_MODE === 'DEV' ? process.env.ADMIN_EMAIL : user.email;
  
  await sendOtpEmail(recipient, otp);

  res.status(200).json({ message: "If your email is registered, you will receive an OTP shortly." });
};

/**
 * Verify OTP
 */
const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body; 
  // Wait, frontend usually sends email + OTP or just OTP if session exists?
  // User flow: 
  // 1. Forgot Page -> Email -> API returns "OK". User redirected to Verify Page.
  // 2. Verify Page -> Enters OTP.
  // We need to know WHICH user.
  // Usually, Frontend passes email again or we returned a temporary ID.
  // Let's expect { email, otp } from frontend.
  
  const email = req.body?.email?.toLowerCase();
  const inputOtp = req.body?.otp;

  if (!email || !inputOtp) {
    throw new CustomErrorHandler(400, "Email and OTP are required");
  }

  const user = await User.findOne({ email });

  if (!user || user.resetOtp !== inputOtp || user.resetOtpExpiry < Date.now()) {
    throw new CustomErrorHandler(400, "Invalid or expired OTP");
  }

  // OTP Valid
  // Generate temporary token for reset password step
  const resetToken = jwt.sign(
    { email: user.email, purpose: "password_reset" }, 
    process.env.SECRET_TOKEN_KEY, 
    { expiresIn: "10m" }
  );

  res.status(200).json({ 
    message: "OTP verified",
    token: resetToken 
  });
};

/**
 * Reset Password
 */
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new CustomErrorHandler(400, "Token and new password are required");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
  } catch (err) {
    throw new CustomErrorHandler(400, "Invalid or expired token");
  }

  if (decoded.purpose !== "password_reset") {
    throw new CustomErrorHandler(400, "Invalid token purpose");
  }

  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw new CustomErrorHandler(404, "User not found");
  }

  if (newPassword.length < 6) {
      throw new CustomErrorHandler(400, "Password must be at least 6 characters");
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
};

module.exports = { forgotPassword, verifyOtp, resetPassword };
