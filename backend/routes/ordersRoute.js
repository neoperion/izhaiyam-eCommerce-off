const express = require("express");
const { postUserOrders, getAllOrders, getSpecificAdminOrder, getAllUsers, getSingleUser, updateUser, updateUserStatus, deleteUser, updateOrderTracking, deleteOrder, getTopSellingProducts, updateOrderStatus, createManualOrder } = require("../controllers/Orders");
const { exportOrders, exportOrderById } = require("../controllers/exportController");
const { createRazorpayOrder, verifyPayment } = require("../controllers/paymentController");
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation");
const { validateRequest } = require("../middleware/validationMiddleware");
const orderSchemas = require("../validators/orderSchemas");

const router = express.Router();

router.route("/placeOrders").post(validateRequest(orderSchemas.authOrder), postUserOrders);
router.route("/create-razorpay-order").post(validateRequest(orderSchemas.createRazorpay), createRazorpayOrder);
router.route("/verify-payment").post(validateRequest(orderSchemas.verifyPayment), verifyPayment);

router.route("/all").get(checkIfUserIsAnAdminMiddleware, getAllOrders);
router.route("/admin/order/:id")
    .get(checkIfUserIsAnAdminMiddleware, getSpecificAdminOrder)
    .delete(checkIfUserIsAnAdminMiddleware, deleteOrder);

// Manual Order Route
router.route("/admin/manual-order").post(checkIfUserIsAnAdminMiddleware, createManualOrder);

router.route("/users").get(checkIfUserIsAnAdminMiddleware, getAllUsers);
router.route("/users/:id").get(checkIfUserIsAnAdminMiddleware, getSingleUser);
router.route("/users/:id").patch(checkIfUserIsAnAdminMiddleware, updateUser);
router.route("/users/:id/status").patch(checkIfUserIsAnAdminMiddleware, validateRequest(orderSchemas.updateUserStatus), updateUserStatus);
router.route("/users/:id").delete(checkIfUserIsAnAdminMiddleware, deleteUser);

router.route("/updateTracking/:orderId").put(checkIfUserIsAnAdminMiddleware, validateRequest(orderSchemas.updateTracking), updateOrderTracking);
router.route("/updateStatus/:orderId").put(checkIfUserIsAnAdminMiddleware, validateRequest(orderSchemas.updateStatus), updateOrderStatus);

router.route("/export/:range").get(checkIfUserIsAnAdminMiddleware, exportOrders);
router.route("/export/order/:id").get(checkIfUserIsAnAdminMiddleware, exportOrderById);
router.route("/dashboard/top-selling").get(checkIfUserIsAnAdminMiddleware, getTopSellingProducts);

module.exports = router;
