const express = require("express");
<<<<<<< HEAD
const { postUserOrders, getAllOrders, getSpecificAdminOrder, getAllUsers, getSingleUser, updateUser, updateUserStatus, deleteUser, updateOrderTracking, deleteOrder, getTopSellingProducts } = require("../controllers/Orders");
=======
const { postUserOrders, getAllOrders, getSpecificAdminOrder, getAllUsers, getSingleUser, updateUser, updateUserStatus, deleteUser, updateOrderTracking, deleteOrder, getTopSellingProducts, updateOrderStatus } = require("../controllers/Orders");
>>>>>>> cc7c13146cb0bb8da83b72b768b2faf058891232
const { exportOrders, exportOrderById } = require("../controllers/exportController");
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
<<<<<<< HEAD
=======
router.route("/updateStatus/:orderId").put(checkIfUserIsAnAdminMiddleware, updateOrderStatus);
>>>>>>> cc7c13146cb0bb8da83b72b768b2faf058891232
router.route("/export/:range").get(checkIfUserIsAnAdminMiddleware, exportOrders);
router.route("/export/order/:id").get(checkIfUserIsAnAdminMiddleware, exportOrderById);
router.route("/dashboard/top-selling").get(checkIfUserIsAnAdminMiddleware, getTopSellingProducts);

module.exports = router;
