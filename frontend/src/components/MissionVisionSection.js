import React from 'react';
import { motion } from 'framer-motion';

const MissionVisionSection = () => {
  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6 bg-secondary/30 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-stretch">
          
          {/* Mission Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="group relative overflow-hidden bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-12 lg:p-14 shadow-soft hover:shadow-hover transition-all duration-500 border border-border flex flex-col items-center text-center md:items-start md:text-left"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-700 group-hover:bg-primary/20"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between w-full">
              <div className="flex flex-col items-center md:items-start">
                <motion.span 
                  className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4 md:mb-6"
                >
                  Purpose
                </motion.span>
                <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-8 leading-tight">
                  Our Mission
                </h2>
                <div className="w-16 h-1 bg-primary rounded-full mb-6 md:mb-8 group-hover:w-24 transition-all duration-500"></div>
              </div>
              
              <p className="font-inter text-base md:text-lg lg:text-xl text-black leading-relaxed font-light">
                “Our mission is to create furniture that supports a <span className="font-medium text-black">healthy future generation</span> — sustainable, breathable, chemical-free, and crafted with care.”
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="group relative overflow-hidden bg-wood-header rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-12 lg:p-14 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center md:items-start md:text-left"
          >
            {/* Background Decor */}
            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-white/40 rounded-full blur-3xl -ml-10 -mb-10 transition-all duration-700 group-hover:bg-white/60"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between w-full">
              <div className="flex flex-col items-center md:items-start">
                <motion.span 
                  className="inline-block px-4 py-1.5 rounded-full bg-foreground/5 text-foreground/70 text-xs font-bold tracking-widest uppercase mb-4 md:mb-6"
                >
                  Future
                </motion.span>
                <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-8 leading-tight">
                  Our Vision
                </h2>
                <div className="w-16 h-1 bg-foreground/30 rounded-full mb-6 md:mb-8 group-hover:w-24 transition-all duration-500"></div>
              </div>
              
              <p className="font-inter text-base md:text-lg lg:text-xl text-black leading-relaxed font-light">
                “A world with a <span className="font-medium text-black">healthier lifestyle</span> and a commitment to ensure <span className="font-medium text-black">traditional crafts</span> never disappear.”
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
