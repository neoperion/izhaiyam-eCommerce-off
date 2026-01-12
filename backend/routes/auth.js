const express = require("express");
const { googleLogin } = require("../controllers/googleAuthController.js");

const router = express.Router();

router.post("/google-login", googleLogin);

module.exports = router;
