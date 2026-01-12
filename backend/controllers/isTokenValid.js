const CustomErrorHandler = require("../errors/customErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userData");

const isTokenvalid = async (req, res) => {
  let authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomErrorHandler(401, false);
  } else {
    let decodedPayload;
    try {
       decodedPayload = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    } catch (err) {
       throw new CustomErrorHandler(401, false);
    }

    if (!decodedPayload || !decodedPayload.email) {
       throw new CustomErrorHandler(401, false);
    }

    // Robust User Lookup (By Email from Token, not Token Match)
    let checkIfTokenExist = await User.findOne({ email: decodedPayload.email });

    if (!checkIfTokenExist) {
      throw new CustomErrorHandler(401, false);
    } else {
      res.status(200).json({ success: true, user: checkIfTokenExist });
    }
  }
};
module.exports = isTokenvalid;
