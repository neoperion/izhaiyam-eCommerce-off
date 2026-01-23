import React from 'react';

const CLIENT_HOMES_IMAGES = [
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929389/IMG_6225_bmiboe.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929382/IMG_7633_qrlsyu.jpg",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929180/IMG_0933_a8qk9e.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929161/IMG_1139_pkeegw.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929052/IMG_8445_xl8gtb.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929014/IMG_6223_i7nc9g.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929011/IMG_6996_t9nsfx.jpg",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929004/IMG_4207_ekzpbw.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768928992/IMG_4206_wh3xuh.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768928885/IMG_1644_qg8pri.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768928690/IMG_1003_xvhcn9.heic"
];

const ClientHomesSection = () => {
  // Process images to ensure they display (convert heic to jpg for browser support)
  const images = CLIENT_HOMES_IMAGES.map(url => {
    // Replace .heic with .jpg for browser compatibility if needed, 
    // or rely on Cloudinary's f_auto if we were transforming properly, 
    // but simple extension swap works for standard Cloudinary URLs usually.
    return {
      url: url.replace(/\.heic$/i, '.jpg'),
      caption: "Happy Home",
      location: "Chennai, TN"
    };
  });

  return (
    <section className="gallery-section container-page">
      <div className="gallery-section-header">
        <h2 className="gallery-section-title font-inter">Client Homes</h2>
        <p className="gallery-section-subtitle font-inter">
          Trusted by families across Tamil Nadu.
        </p>
      </div>

      <div className="client-homes-container">
        {images.map((item, index) => (
          <div key={index} className="client-home-card">
            <img src={item.url} alt="Client Home" className="client-home-image" loading="lazy" />
            <div className="client-home-info">
              <h5 className="font-bold font-inter text-lg">
                {item.caption}
              </h5>
              <div className="client-location font-inter">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {item.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientHomesSection;
