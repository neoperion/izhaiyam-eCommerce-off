import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './GalleryPage.css';
import API from '../../config';

// Components
import GalleryHero from '../../components/Gallery/GalleryHero/GalleryHero';
import WorkshopSection from '../../components/Gallery/WorkshopSection';
import FounderSection from '../../components/Gallery/FounderSection/FounderSection';
import InstagramSection from '../../components/Gallery/InstagramSection';
import CelebritySection from '../../components/Gallery/CelebritySection';
import ClientHomesSection from '../../components/Gallery/ClientHomesSection';
import FooterSection from '../../components/footerSection';

const GalleryPage = () => {
  const [galleryData, setGalleryData] = useState({
    hero: [],
    workshop: [],
    founder: [],
    instagram: [],
    celebrity: [],
    'client-homes': [],
    'shop-images': []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchGalleryData = async () => {
      try {
        const { data } = await axios.get(`${API}/api/v1/gallery`);
        
        if (data.success && data.data) {
           setGalleryData(data.data);
        } else {
           setGalleryData(data);
        }
      } catch (error) {
        console.error("Failed to fetch gallery data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#faf9f6]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="gallery-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GalleryHero data={galleryData.hero} />
    
      <WorkshopSection data={galleryData.workshop} />
      
      <FounderSection data={galleryData.founder} />
      
      <InstagramSection data={galleryData.instagram} />
      
      <CelebritySection data={galleryData.celebrity} />
      
      <ClientHomesSection data={galleryData['client-homes']} />
      
      <FooterSection />
    </motion.div>
  );
};

export default GalleryPage;
