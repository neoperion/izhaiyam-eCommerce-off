const express = require("express");
const router = express.Router();
const {
  getAllNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation");

// All routes here should be protected for admin
router.get("/", checkIfUserIsAnAdminMiddleware, getAllNotifications);
router.patch("/:id/read", checkIfUserIsAnAdminMiddleware, markAsRead);
router.delete("/:id", checkIfUserIsAnAdminMiddleware, deleteNotification);

module.exports = router;
