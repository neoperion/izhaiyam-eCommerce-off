/**
 * Cloudinary Dynamic Watermark Utility
 * 
 * Applies a brand watermark dynamically at runtime using Cloudinary URL transformations.
 * Optimizes watermark size for desktop vs mobile.
 * 
 * Watermark public_id: logo_qpvz1g
 * 
 * Desktop: 300px width, 30% opacity, bottom-right, 20px padding
 * Mobile: 180px width, 25% opacity, bottom-right, 12px padding
 */

/**
 * Transform Cloudinary image URL to include watermark overlay
 * @param {string} imageUrl - Original Cloudinary image URL
 * @returns {string} - Image URL with watermark transformation applied
 */
export function withWatermark(imageUrl) {
  // Return original if not a valid Cloudinary URL
  if (!imageUrl || !imageUrl.includes("/upload/")) {
    return imageUrl;
  }

  // Detect mobile vs desktop based on window width
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Watermark transformation based on device
  const watermarkTransform = isMobile
    ? "l_logo_qpvz1g,w_180,o_25,g_south_east,x_12,y_12"
    : "l_logo_qpvz1g,w_300,o_30,g_south_east,x_20,y_20";

  // Inject transformation after /upload/
  return imageUrl.replace(
    "/upload/",
    `/upload/${watermarkTransform}/`
  );
}

/**
 * Apply watermark to an array of image URLs
 * @param {string[]} imageUrls - Array of Cloudinary image URLs
 * @returns {string[]} - Array of image URLs with watermark applied
 */
export function withWatermarkArray(imageUrls) {
  if (!Array.isArray(imageUrls)) {
    return imageUrls;
  }
  return imageUrls.map(url => withWatermark(url));
}

export default withWatermark;
