const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userData");
const crypto = require("crypto");
const { generateToken } = require("./userAuthentication"); // Import from existing controller

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name, picture, given_name, family_name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      
      user = await User.create({
        firstName: given_name || name.split(' ')[0] || "User",
        lastName: family_name || name.split(' ')[1] || "Name",
        username: email.split('@')[0], 
        email,
        password: randomPassword, 
        avatar: picture,
        authType: "google",
        verificationStatus: "verified"
      });
    }

    // GENERATE TOKEN USING IMPORTED FUNCTION (Ensures same secret/payload)
    const jwtToken = generateToken(user.email, "verified", "30d");

    // SAVE TOKEN TO DB
    await User.findByIdAndUpdate({ _id: user._id }, { verificationToken: jwtToken });

    // Prepare response object
    const userObj = user.toObject ? user.toObject() : user;

    res.json({
      message: "You have sucessfully logged in",
      userData: {
        ...userObj,
        loginToken: jwtToken
      }
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(401).json({ success: false, message: "Google login failed" });
  }
};

module.exports = { googleLogin };
