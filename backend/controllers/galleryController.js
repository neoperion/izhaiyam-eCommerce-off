
const cloudinary = require('cloudinary').v2;
const InstagramPost = require('../models/InstagramPost');

let galleryCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour for Cloudinary images

const getGalleryImages = async (req, res) => {
  try {
    let results = {};
    let isCacheValid = galleryCache && (Date.now() - lastFetchTime < CACHE_DURATION);

    // 1. Get Cloudinary Content (Cached or Fresh)
    if (isCacheValid) {
      console.log("🟢 Serving Cloudinary assets from cache");
      results = { ...galleryCache };
      if (results.workshop) {
         console.log(`📦 Cached workshop items: ${results.workshop.length}`);
      }
    } else {
      console.log("🔵 Fetching gallery from Cloudinary...");

      const folders = [
        'hero',
        'founder',
        // 'instagram', // Removed: Now served from MongoDB
        'celebrity',
        'client-homes'
      ];

      // Fetch gallery folders
      await Promise.all(folders.map(async (folder) => {
        try {
          const folderPath = `gallery/${folder}`;
          const result = await cloudinary.search
            .expression(`folder:"${folderPath}"`)
            .sort_by('created_at', 'desc')
            .max_results(16)
            .with_field('context')
            .execute();

          results[folder] = result.resources.map(img => ({
            public_id: img.public_id,
            url: img.secure_url,
            width: img.width,
            height: img.height,
            format: img.format,
            context: img.context
          }));
        } catch (err) {
          console.error(`Error fetching ${folder}:`, err.message);
          results[folder] = [];
        }
      }));

      // Fetch workshop images
      try {
        const workshopResult = await cloudinary.search
          .expression('folder:workshop')
          .sort_by('created_at', 'desc')
          .max_results(100)
          .with_field('context')
          .execute();
        
        results['workshop'] = workshopResult.resources.map(img => ({
          public_id: img.public_id,
          url: img.secure_url,
          width: img.width,
          height: img.height,
          format: img.format,
          context: img.context,
          resource_type: img.resource_type
        }));
      } catch (err) {
        console.error('Error fetching workshop:', err.message);
        results['workshop'] = [];
      }

      // Fetch shop images
      try {
        const shopResult = await cloudinary.search
          .expression('folder:my_brand')
          .sort_by('created_at', 'desc')
          .max_results(50)
          .execute();

        results['shop-images'] = shopResult.resources.map(img => ({
          public_id: img.public_id,
          url: img.secure_url,
          width: img.width,
          height: img.height,
          format: img.format,
          context: img.context,
          resource_type: img.resource_type
        }));
      } catch (err) {
        console.error('Error fetching my_brand:', err.message);
        results['shop-images'] = [];
      }

      // Update Cache
      galleryCache = { ...results };
      lastFetchTime = Date.now();
    }

    // 2. Always Insert Fresh Instagram Data from MongoDB
    try {
       const instagramPosts = await InstagramPost.find({ isActive: true }).sort({ displayOrder: 1 });
       
       results['instagram'] = instagramPosts.map(post => ({
         _id: post._id,
         url: post.thumbnailUrl, 
         link: post.instagramUrl,
         embedUrl: post.embedUrl,
         type: 'instagram_post'
       }));
    } catch (dbErr) {
       console.error("❌ Error fetching Instagram posts from DB:", dbErr);
       results['instagram'] = []; 
    }


    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Gallery Controller Error:', error);
    res.status(500).json({ success: false, msg: 'Failed to fetch gallery images', error: error.message });
  }
};

module.exports = { getGalleryImages };
