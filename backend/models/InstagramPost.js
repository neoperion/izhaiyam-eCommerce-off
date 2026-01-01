const mongoose = require('mongoose');

console.log("Loading InstagramPost Model (PRO Schema)...");

const instagramPostSchema = new mongoose.Schema({
  instagramUrl: {
    type: String,
    required: [true, 'Please provide an Instagram Post URL'],
    match: [
      /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/(p|reel)\/([A-Za-z0-9-_\.]+)\/?/,
      'Please provide a valid Instagram Post or Reel URL'
    ]
  },
  embedUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('InstagramPost', instagramPostSchema, 'instagram_gallery');
