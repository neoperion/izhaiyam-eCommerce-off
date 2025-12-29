const User = require("../models/userData");
const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../errors/customErrorHandler");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomErrorHandler(401, "Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    
    // Attach the user to the request object
    // We fetch the user to ensure they still exist and to get the ID
    const user = await User.findOne({ email: payload.email }).select("_id email username");
    
    if (!user) {
        throw new CustomErrorHandler(401, "Authentication Invalid");
    }

    req.user = { userId: user._id, email: user.email, username: user.username };
    next();
  } catch (error) {
    throw new CustomErrorHandler(401, "Authentication Invalid");
  }
};

module.exports = authenticateUser;
