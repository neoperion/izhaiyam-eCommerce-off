const express = require("express");
const { registerUser, loginUser, deleteUser } = require("../controllers/userAuthentication");
const { forgotPassword, verifyOtp, resetPassword } = require("../controllers/otpController");
const handleEmailLinkClick = require("../middleware/handleEmailLinkClick");
const isTokenvalid = require("../controllers/isTokenValid");
const resendEmailVerification = require("../controllers/resendEmailVerification");
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation.js");
const { validateRequest } = require("../middleware/validationMiddleware");
const authSchemas = require("../validators/authSchemas");

const router = express.Router();

router.route("/verifyGmail/:task").get(handleEmailLinkClick);
router.route("/isTokenValid").get(isTokenvalid);

router.route("/register").post(validateRequest(authSchemas.register), registerUser);
router.route("/login").post(validateRequest(authSchemas.login), loginUser);
router.route("/resendEmailVerificationLink").post(validateRequest(authSchemas.resendVerification), resendEmailVerification);
router.route("/deleteUser").delete(checkIfUserIsAnAdminMiddleware, deleteUser);

// NEW: OTP Based Forgot Password Flow
router.route("/forgot-password").post(validateRequest(authSchemas.forgotPassword), forgotPassword);
router.route("/verify-otp").post(validateRequest(authSchemas.verifyOtp), verifyOtp);
router.route("/reset-password").post(validateRequest(authSchemas.resetPassword), resetPassword);

module.exports = router;
