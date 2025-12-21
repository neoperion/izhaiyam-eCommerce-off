const User = require("../models/userData");
const jwt = require("jsonwebtoken");
const { checkEmailHost, sendMessageToUserEmail } = require("./sendMailToUsers");
const CustomErrorHandler = require("../errors/customErrorHandler");
const bcryptjs = require("bcryptjs");

const generateToken = (email, verificationStatus, expiryDate) => {
  let token = jwt.sign({ email, verificationStatus }, process.env.SECRET_TOKEN_KEY, { expiresIn: expiryDate });
  return token;
};

// verify user's account

const emailVerificationMessageDatas = (emailVerificationToken) => {
  const mailUser = process.env.MAIL_FOR_SENDING;
  const mailPass = process.env.MAIL_PASS;
  const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
  return {
    port: 587,
    secure: false,
    user: mailUser,
    pass: mailPass,
    subject: "[Auffur] Please confirm your email address",
    text: `Please click this link or paste the link in your browser to verify your email address: ${serverUrl}/api/v1/verifyGmail/Email-verification?token=${emailVerificationToken}`,
    html: `<h2>Verify your email address </h2><br/><div>To complete your account registration,please verify that this is your email address by clicking the button below</div><br/> <a href="${serverUrl}/api/v1/auth/verifyGmail/Email-verification?token=${emailVerificationToken}" style="display: inline-block; padding: 0.5em 1em; background-color: #fca311; color: white; text-decoration: none;">Verify Email</a> <br /> <br /> <br /> <div>This link will expire in 5days.If you didnt request this code,you can safely ignore this email,Someone else might have typed your email address by mistake</div> <br /> <span>Thanks,</span> <br /> <span>Auffur Team</span>`,
  };
};

//Register
//Register
const registerUser = async (req, res) => {
  const { firstName, lastName, username, password, phone } = req.body;
  const email = req.body?.email?.toLowerCase();

  // Validate phone
  if (!phone) {
    throw new CustomErrorHandler(400, "Please enter a phone number");
  }

  let checkIfEmailExists = await User.findOne({ email });
  let checkIfPhoneExists = await User.findOne({ phone });

  const hashedpassword = await bcryptjs.hash(password, 10);

  if (checkIfEmailExists) {
    throw new CustomErrorHandler(400, "Email has already been registered by another user");
  } 
  
  if (checkIfPhoneExists) {
    throw new CustomErrorHandler(400, "Phone number has already been registered by another user");
  }

  await User.create({
    firstName,
    lastName,
    email,
    phone,
    username,
    password: hashedpassword,
    verificationStatus: "verified",
  });

  res.send(
    "Account created successfully. Welcome aboard!"
  );
};

//LOGIN
const loginUser = async (req, res) => {
  const { password } = req.body;
  
  // Identifier can be email OR phone
  // We check req.body.email (legacy/standard) OR req.body.identifier (new generic)
  const identifier = (req.body.email || req.body.phone || req.body.identifier || "").toLowerCase();

  if (!identifier) {
    throw new CustomErrorHandler(400, "Please enter email or phone number");
  }

  // Check if identifier is email-like or phone-like
  const isEmail = identifier.includes("@");
  
  let user;
  
  if (isEmail) {
    user = await User.findOne({ email: identifier }).lean();
  } else {
    // Determine if we need to search by phone
    // Note: Assuming phone is stored as string in DB. 
    user = await User.findOne({ phone: identifier }).lean();
  }

  if (!user) {
    throw new CustomErrorHandler(400, "Incorect email/phone or password");
  }

  const isPasswordMatch = await bcryptjs.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new CustomErrorHandler(400, "Incorect email/phone or password");
  }

  // If login success
  let loginToken = generateToken(user.email, "verified", "30d");

  // Update token in DB
  await User.findByIdAndUpdate({ _id: user._id }, { verificationToken: loginToken });

  res.json({
    message: "You have sucessfully logged in",
    userData: { ...user, loginToken },
  });
};

// DELETE USERS

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomErrorHandler(401, "parameters missing");
  }
  const user = await User.findByIdAndDelete(id);

  res.status(201).json({});
};

module.exports = { registerUser, loginUser, generateToken, emailVerificationMessageDatas, deleteUser };
