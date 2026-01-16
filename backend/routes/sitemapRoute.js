const express = require("express");
const { generateSitemap } = require("../controllers/sitemapController");

const router = express.Router();

router.get("/", generateSitemap);

module.exports = router;
