const InstagramPost = require('../models/InstagramPost');
const { StatusCodes } = require('http-status-codes');

// Helper to extract ID and clean URL
const extractInstagramInfo = (url) => {
  try {
    // Regex to match /p/ID or /reel/ID
    const match = url.match(/(?:p|reel)\/([A-Za-z0-9-_\.]+)/);
    if (!match || !match[1]) return null;

    const id = match[1];
    const cleanUrl = `https://www.instagram.com/reel/${id}/`; // Normalized to reel/id format or keep original? 
    // User requested supported formats: /reel/{id}/ and /p/{id}/. 
    // Let's normalize the stored URL to be clean but keep the type if possible.
    // Actually, just cleaning the query params is safer.
    
    // Construct embed URL
    const embedUrl = `https://www.instagram.com/p/${id}/embed`;
    
    // Construct thumbnail URL (Public media endpoint hack)
    // Works for many public posts: https://www.instagram.com/p/{id}/media/?size=l
    const thumbnailUrl = `https://www.instagram.com/p/${id}/media/?size=l`;

    return {
      instagramUrl: url.split('?')[0].replace(/\/$/, '') + '/',
      embedUrl,
      thumbnailUrl
    };
  } catch (e) {
    return null;
  }
};

// Add new post
const createPost = async (req, res) => {
  try {
    const { instagramUrl } = req.body;

    if (!instagramUrl) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Please provide an Instagram URL' });
    }

    const info = extractInstagramInfo(instagramUrl);
    if (!info) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false, 
        message: 'Invalid Instagram URL. Could not extract ID.' 
      });
    }

    // Auto assign displayOrder
    const lastPost = await InstagramPost.findOne().sort({ displayOrder: -1 });
    const displayOrder = lastPost ? lastPost.displayOrder + 1 : 1;

    const post = await InstagramPost.create({
      instagramUrl: info.instagramUrl,
      embedUrl: info.embedUrl,
      thumbnailUrl: info.thumbnailUrl,
      isActive: true,
      displayOrder
    });

    res.status(StatusCodes.CREATED).json({ success: true, post });
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// Get all posts (public - active only)
const getAllPosts = async (req, res) => {
  try {
    const posts = await InstagramPost.find({ isActive: true }).sort({ displayOrder: 1 });
    res.status(StatusCodes.OK).json({ success: true, posts });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// Get all posts (admin)
const getAdminPosts = async (req, res) => {
  try {
    const posts = await InstagramPost.find({}).sort({ displayOrder: 1 });
    res.status(StatusCodes.OK).json({ success: true, posts });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// Update post (status)
const updatePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { isActive } = req.body;

    const post = await InstagramPost.findOne({ _id: postId });

    if (!post) {
       return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `No post found with id : ${postId}` });
    }

    if (isActive !== undefined) post.isActive = isActive;
    
    await post.save();

    res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const post = await InstagramPost.findOne({ _id: postId });

    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `No post found with id : ${postId}` });
    }

    await post.remove();
    res.status(StatusCodes.OK).json({ success: true, msg: 'Success! Post removed.' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// Bulk reorder
const reorderPosts = async (req, res) => {
  try {
    const { posts } = req.body; 
    if (!posts || !Array.isArray(posts)) {
       return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Please provide a list of posts to reorder' });
    }

    const operations = posts.map(post => ({
      updateOne: {
        filter: { _id: post._id },
        update: { displayOrder: post.displayOrder }
      }
    }));

    if (operations.length > 0) {
      await InstagramPost.bulkWrite(operations);
    }

    res.status(StatusCodes.OK).json({ success: true, msg: 'Success! Posts reordered.' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getAdminPosts,
  updatePost,
  deletePost,
  reorderPosts
};
