const { default: mongoose } = require("mongoose");
const CustomErrorHandler = require("../errors/customErrorHandler");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomErrorHandler) {
    console.log('CustomError handled:', err.statusCode, err.message);
    res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof mongoose.Error.ValidationError) {
    console.log('Validation Error:', err.message);
    res.status(400).json({ message: err._message || err.message });
  } else {
    console.log('Unexpected Error handled:', err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = errorHandler;
