const express = require("express");
const { registerUser, loginUser, deleteUser } = require("../controllers/userAuthentication");
const { forgotPassword, verifyOtp, resetPassword } = require("../controllers/otpController");
const handleEmailLinkClick = require("../middleware/handleEmailLinkClick");
const isTokenvalid = require("../controllers/isTokenValid");
const resendEmailVerification = require("../controllers/resendEmailVerification");
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation.js");

const router = express.Router();

router.route("/verifyGmail/:task").get(handleEmailLinkClick);
router.route("/isTokenValid").get(isTokenvalid);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/resendEmailVerificationLink").post(resendEmailVerification);
router.route("/deleteUser").delete(checkIfUserIsAnAdminMiddleware, deleteUser);

// NEW: OTP Based Forgot Password Flow
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(resetPassword);

module.exports = router;
