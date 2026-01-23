const cloudinary = require('cloudinary').v2;

let galleryCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const getGalleryImages = async (req, res) => {
  try {
    // Check if cache is valid
    if (galleryCache && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      console.log("🟢 Serving gallery from cache");
      if (galleryCache.workshop) {
         console.log(`📦 Cached workshop items: ${galleryCache.workshop.length}`);
         galleryCache.workshop.forEach(i => console.log(` - ${i.public_id} (${i.format})`));
      }
      return res.status(200).json({ success: true, data: galleryCache });
    }

    console.log("🔵 Fetching gallery from Cloudinary...");

    const folders = [
      'hero',
      'founder',
      'instagram',
      'celebrity',
      'client-homes'
    ];

    const results = {};

    // Fetch gallery folders using Cloudinary Search API
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

    // Fetch workshop images explicitly from root 'workshop' folder
    try {
      const workshopResult = await cloudinary.search
        .expression('folder:workshop')
        .sort_by('created_at', 'desc')
        .max_results(100)
        .with_field('context')
        .execute();
      
      console.log(`✅ Cloudinary found ${workshopResult.resources.length} workshop items`);
      workshopResult.resources.forEach(r => console.log(`   > ${r.public_id} | ${r.secure_url}`));

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

    // Fetch shop images from "My Brand/shop-image" folder
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

    // Update cache
    galleryCache = results;
    lastFetchTime = Date.now();

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Gallery Controller Error:', error);
    res.status(500).json({ success: false, msg: 'Failed to fetch gallery images', error: error.message });
  }
};

module.exports = { getGalleryImages };
