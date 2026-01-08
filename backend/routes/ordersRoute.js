const express = require("express");
const { postUserOrders, getAllOrders, getSpecificAdminOrder, getAllUsers, getSingleUser, updateUser, updateUserStatus, deleteUser, updateOrderTracking, deleteOrder } = require("../controllers/Orders");
const { createRazorpayOrder, verifyPayment } = require("../controllers/paymentController");
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation");

const router = express.Router();

router.route("/placeOrders").post(postUserOrders);
router.route("/create-razorpay-order").post(createRazorpayOrder);
router.route("/verify-payment").post(verifyPayment);
router.route("/all").get(checkIfUserIsAnAdminMiddleware, getAllOrders);
router.route("/admin/order/:id")
    .get(checkIfUserIsAnAdminMiddleware, getSpecificAdminOrder)
    .delete(checkIfUserIsAnAdminMiddleware, deleteOrder); // Added DELETE route
router.route("/users").get(checkIfUserIsAnAdminMiddleware, getAllUsers);
router.route("/users/:id").get(checkIfUserIsAnAdminMiddleware, getSingleUser);
router.route("/users/:id").patch(checkIfUserIsAnAdminMiddleware, updateUser);
router.route("/users/:id/status").patch(checkIfUserIsAnAdminMiddleware, updateUserStatus);
router.route("/users/:id").delete(checkIfUserIsAnAdminMiddleware, deleteUser);
router.route("/updateTracking/:orderId").put(checkIfUserIsAnAdminMiddleware, updateOrderTracking);

module.exports = router;
