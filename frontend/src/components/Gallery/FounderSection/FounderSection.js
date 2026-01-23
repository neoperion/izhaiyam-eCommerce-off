import React from 'react';
import { motion } from 'framer-motion';
import './FounderSection.css'; // Import the new styles

import founderImg from '../../../assets/team/suriya_kanniyappan.png';

const FounderSection = ({ data }) => {
  const founderImage = founderImg;

  return (
    <section className="founder-section section-padding">
      <div className="container-page founder-content">
        <motion.div 
          className="founder-image-wrapper"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img src={founderImage} alt="M. Suriya Kanniyappan - Founder" className="founder-image" loading="lazy" />
        </motion.div>
        
        <motion.div 
          className="founder-text"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <h3>A Message from Our Founder</h3>
          <div className="founder-quote">
            "Izhaiyam was born to protect our handloom tradition while bringing it into modern homes. 
            Every product carries the hands and heart of our artisans."
          </div>
          
          <div className="mt-8">
            <p className="founder-name">M. Suriya Kanniyappan</p>
            <p className="founder-title">Founder, Izhaiyam</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
