const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getAdminPosts,
  updatePost,
  deletePost,
  reorderPosts
} = require('../controllers/instagramController');

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation");

// Public route to get active posts
router.route('/public').get(getAllPosts);

// Admin routes
router.route('/admin')
  .get(checkIfUserIsAnAdminMiddleware, getAdminPosts)
  .post(checkIfUserIsAnAdminMiddleware, createPost);

router.route('/admin/reorder')
  .patch(checkIfUserIsAnAdminMiddleware, reorderPosts);

router.route('/admin/:id')
  .put(checkIfUserIsAnAdminMiddleware, updatePost)
  .delete(checkIfUserIsAnAdminMiddleware, deletePost);

module.exports = router;
