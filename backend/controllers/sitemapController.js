const Product = require("../models/products"); // Adjusted path based on typical structure

const generateSitemap = async (req, res) => {
  try {
    const products = await Product.find({}, "_id title updatedAt");
    
    // Base URL
    const baseUrl = "https://www.izhaiyam.com";
    
    // Static Pages
    const staticPages = [
      "",
      "/shop",
      "/aboutUs",
      "/contactUs",
      "/privacy-policy",
      "/terms-and-conditions",
      "/return-refund-policy",
      "/shipping-policy"
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map((url) => {
      return `
  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === "" ? "1.0" : "0.8"}</priority>
  </url>`;
    })
    .join("")}
  ${products
    .map((product) => {
      return `
  <url>
    <loc>${baseUrl}/product/${product._id}</loc>
    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    })
    .join("")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
};

module.exports = { generateSitemap };
