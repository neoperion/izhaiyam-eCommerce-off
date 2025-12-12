import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { cld } from '../utils/cloudinaryConfig';

const CloudinaryImage = ({ publicId, width = 500, height = 500, alt = '', className = '' }) => {
  // Transform the image: auto-crop to square aspect_ratio
  const img = cld
    .image(publicId)
    .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(width).height(height));

  return <AdvancedImage cldImg={img} alt={alt} className={className} />;
};

export default CloudinaryImage;
