import { Cloudinary } from '@cloudinary/url-gen';

// Create and export Cloudinary instance with your cloud name
export const cld = new Cloudinary({ 
  cloud: { 
    cloudName: 'deft85hk9' 
  } 
});
