const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../errors/customErrorHandler");
const Admin = require("../models/admin");
const User = require("../models/userData");

const checkIfUserIsAnAdminMiddleware = async (req, res, next) => {
  console.log('Checking admin permissions for:', req.headers.authorization);
  let authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1] || " ";

  let tokenVerification;
  let decodedPayload;
  try {
    decodedPayload = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    tokenVerification = true;
  } catch (err) {
    console.log('Admin Auth Middleware Error (Verify):', err.message);
    tokenVerification = false;
  }

  // Find user by Email/ID from payload NOT by token string match
  // This is much more robust than requiring the DB to hold the exact current token string
  let checkIfTokenExist = null;
  if(tokenVerification && decodedPayload && decodedPayload.email) {
      checkIfTokenExist = await User.findOne({ email: decodedPayload.email });
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomErrorHandler(401, "Unauthorized,please relogin");
  } else if (!tokenVerification) {
    throw new CustomErrorHandler(401, "Unauthorized,please relogin");
  } else if (!checkIfTokenExist) {
    throw new CustomErrorHandler(401, "Unauthorized,only logged in admin may perfrom action");
  } else if (checkIfTokenExist && checkIfTokenExist.adminStatus === true) {
    // eslint-disable-next-line no-unused-vars
    const adminData = await Admin.findOne({ userData: checkIfTokenExist._id });

    // eslint-disable-next-line no-undef
    res.locals.actionDoer = { doerRank: adminData?.adminRank, doerData: checkIfTokenExist };
    next();
  } else {
    throw new CustomErrorHandler(401, "Unauthorized,only logged in admin may perfrom action");
  }
};

module.exports = { checkIfUserIsAnAdminMiddleware };
