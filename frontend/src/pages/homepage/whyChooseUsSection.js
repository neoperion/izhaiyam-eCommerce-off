import React from "react";

// Import Realistic Feature Images
import imgSustainable from "../../assets/features/sustainable.png";
import imgArtisan from "../../assets/features/artisan.png";
import imgQuality from "../../assets/features/quality.png";
import imgSupport from "../../assets/features/support.png";
import imgCustom from "../../assets/features/custom.png";

export const WhyChooseUsSection = () => {
  const items = [
    {
      id: "01",
      title: "Expertise",
      description: "We leverage years of traditional weaving experience to deliver high-quality handcrafted artifacts.",
      image: imgSustainable,
      bgColor: "bg-[#93a267]/10",
      accentColor: "text-[#D4A373]", // Earthy Gold
      rotate: "-rotate-2",
      translateY: "top-0",
      dotPosition: "right-0"
    },
    {
      id: "02",
      title: "Custom Solutions",
      description: "Each piece is tailored to your space, ensuring your home gets exactly what it needs.",
      image: imgCustom,
      bgColor: "bg-[#93a267]/10",
      accentColor: "text-[#7AA0B8]", // Muted Blue
      rotate: "rotate-3",
      translateY: "top-20 md:top-32",
      dotPosition: "left-0"
    },
    {
      id: "03",
      title: "Customer-Focused",
      description: "We prioritize your satisfaction, offering dedicated support from selection to delivery.",
      image: imgSupport,
      bgColor: "bg-[#93a267]/10",
      accentColor: "text-[#C06B6B]", // Soft Red
      rotate: "-rotate-3",
      translateY: "top-0",
      dotPosition: "right-0"
    },
    {
      id: "04",
      title: "Innovation",
      description: "Merging ancient techniques with modern design to keep your decor ahead of the curve.",
      image: imgArtisan,
      bgColor: "bg-[#93a267]/10",
      accentColor: "text-[#6B9080]", // Sage
      rotate: "rotate-2",
      translateY: "top-20 md:top-32",
      dotPosition: "left-0"
    },
    {
      id: "05",
      title: "Quality Commitment",
      description: "We guarantee longevity. Our materials are chosen to withstand nature and time.",
      image: imgQuality,
      bgColor: "bg-[#93a267]/10",
      accentColor: "text-[#E6B8A2]", // Terracotta
      rotate: "-rotate-1",
      translateY: "top-0",
      dotPosition: "right-0"
    },
  ];

  return (
    <section className="w-full bg-white py-20 px-4 md:px-6 relative overflow-hidden">
        
      {/* Background Dashed Path (Desktop - Snake S-Shape) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block max-w-6xl mx-auto">
         <svg className="w-full h-full" viewBox="0 0 1200 1200" fill="none" preserveAspectRatio="none">
            <path 
                d="M200,150 C500,150 700,400 1000,400 C700,400 500,650 200,650 C500,650 700,900 1000,900 C700,900 500,1150 200,1150" 
                stroke="#E5E7EB" 
                strokeWidth="3" 
                strokeDasharray="12 12"
            />
         </svg>
      </div>

       {/* Background Dashed Path (Mobile - Vertical Line) */}
       <div className="absolute left-8 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-200 lg:hidden"></div>


      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-inter text-3xl md:text-5xl font-bold text-[#2f3e2f] mb-4">
            Why Choose Izhaiyam?
          </h2>
          <p className="font-inter text-gray-500 max-w-xl mx-auto">
             Here’s why homes across the country trust us with their decor.
          </p>
        </div>

        <div className="flex flex-col gap-12 lg:gap-0 lg:block relative">
            {items.map((item, index) => {
                const isEven = index % 2 === 0;
                
                return (
                    <div 
                        key={index} 
                        className={`
                            relative flex flex-col lg:flex-row items-center w-full lg:mb-[-4rem]
                            ${isEven ? 'lg:justify-start' : 'lg:justify-end'}
                        `}
                    >
                        {/* THE CARD */}
                        <div className={`
                            relative w-full lg:w-[45%] bg-white p-3 shadow-xl rounded-[2rem] border border-gray-100 transition-transform duration-500 hover:scale-105 hover:z-20
                            ${item.rotate}
                        `}>
                            {/* Inner Colored Container */}
                            <div className={`${item.bgColor} rounded-[1.5rem] p-6 sm:p-8 h-full flex flex-col items-start gap-4`}>
                                
                                {/* Header: Icon + Title */}
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-sm shrink-0">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-inter text-xl font-bold text-[#2f3e2f]">
                                            {item.title}
                                        </h3>
                                        <div className={`h-1 w-12 rounded-full mt-1 ${item.accentColor.replace('text', 'bg')}/40`}></div>
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <p className="font-inter text-sm text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>

                                {/* Decorative Floating Circle behind */}
                                <div className={`absolute -z-10 -top-6 -right-6 w-20 h-20 rounded-full opacity-20 ${item.accentColor.replace('text', 'bg')}`}></div>
                            </div>

                             {/* Connector Dot (Desktop) */}
                            <div className={`
                                hidden lg:block absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md z-10
                                ${item.accentColor.replace('text', 'bg')}
                                ${isEven ? '-right-14 opacity-0' : '-left-14 opacity-0'} 
                                {/* Note: In a 'timeline', dots are usually on the line. Since the line is S-curve background, strict dots are hard to align perfectly without complex math. 
                                    I will omit the strict connector dots for the S-curve to keep it clean, or just let the card float.
                                */}
                            `}></div>
                        </div>

                         {/* Mobile Connector Dot */}
                         <div className={`lg:hidden absolute left-[-2.1rem] top-8 w-4 h-4 rounded-full border-2 border-white shadow-md z-10 ${item.accentColor.replace('text', 'bg')}`}>
                             {/* This aligns with the mobile vertical line defined at parent level */}
                         </div>

                    </div>
                );
            })}
        </div>
      </div>
    </section>
  );
};
