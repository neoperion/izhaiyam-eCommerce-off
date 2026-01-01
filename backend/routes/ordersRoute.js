const express = require("express");
const { postUserOrders, getAllOrders, getAllUsers, getSingleUser, updateUser, updateUserStatus, deleteUser, updateOrderTracking } = require("../controllers/Orders");
const { createRazorpayOrder, verifyPayment } = require("../controllers/paymentController");
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation");

const router = express.Router();

router.route("/placeOrders").post(postUserOrders);
router.route("/create-razorpay-order").post(createRazorpayOrder);
router.route("/verify-payment").post(verifyPayment);
router.route("/all").get(checkIfUserIsAnAdminMiddleware, getAllOrders);
router.route("/users").get(checkIfUserIsAnAdminMiddleware, getAllUsers);
router.route("/users/:id").get(checkIfUserIsAnAdminMiddleware, getSingleUser);
router.route("/users/:id").patch(checkIfUserIsAnAdminMiddleware, updateUser);
router.route("/users/:id/status").patch(checkIfUserIsAnAdminMiddleware, updateUserStatus);
router.route("/users/:id").delete(checkIfUserIsAnAdminMiddleware, deleteUser);
router.route("/updateTracking/:orderId").put(checkIfUserIsAnAdminMiddleware, updateOrderTracking);

module.exports = router;
