import React from 'react';

const CELEBRITY_IMAGES = [
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768928849/IMG_1235_upruwd.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929374/IMG_0867_ifeurh.jpg",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929234/IMG_1024_iws3p0.jpg"
];

const CelebritySection = () => {
  // Process images
  const images = CELEBRITY_IMAGES.map(url => {
    return {
      url: url.replace(/\.heic$/i, '.jpg'), // Ensure browser compatibility
      caption: "Celebrity Moment",
      description: "Spotted with Izhaiyam"
    };
  });

  return (
    <section className="gallery-section" style={{ backgroundColor: '#f9f9f9' }}>
      <div className="container-page">
        <div className="gallery-section-header">
          <h2 className="gallery-section-title font-inter">Featured With Celebrities</h2>
          <p className="gallery-section-subtitle font-inter">
            Izhaiyam products spotted with your favorite stars.
          </p>
        </div>

        <div className="celebrity-grid">
          {images.map((item, index) => (
            <div key={index} className="celebrity-card">
              <div className="celebrity-image-wrapper">
                {/* Apply cloudinary transformations if needed, or keeping it simple with the replaced URL */}
                <img src={item.url} alt="Celebrity" className="celebrity-image" loading="lazy" />
                <div className="featured-badge font-inter">Featured</div>
              </div>
              <div className="celebrity-info">
                <h4 className="font-bold text-xl font-inter mb-1">
                  {item.caption}
                </h4>
                <p className="text-sm text-gray-500 font-inter">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CelebritySection;
