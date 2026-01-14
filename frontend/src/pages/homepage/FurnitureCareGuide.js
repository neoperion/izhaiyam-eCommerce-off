import React from "react";

// Import Realistic Care Images
import imgCleaning from "../../assets/features/care_cleaning.png";
import imgSun from "../../assets/features/care_sun.png";
import imgWater from "../../assets/features/care_water.png";
import imgHandling from "../../assets/features/care_handling.png";

export const FurnitureCareGuide = () => {
  const tips = [
    {
      title: "Daily Cleaning",
      text: "Use a soft dry or slightly damp cloth to wipe the surface. Avoid harsh chemicals or abrasive cleaners that can damage the polish.",
      image: imgCleaning,
      step: "01"
    },
    {
      title: "Sun & Heat Protection",
      text: "Direct rays can fade the natural wood finish. Position furniture away from bright windows or use sheers to diffuse the light.",
      image: imgSun,
      step: "02"
    },
    {
      title: "Water Care",
      text: "Wood breathes. If spills occur, wipe them immediately. Do not place wet items directly on the surface without coasters.",
      image: imgWater,
      step: "03"
    },
    {
      title: "Gentle Handling",
      text: "Always lift your furniture when moving it. Dragging can weaken joints and damage legs. Handle with the same love it was made with.",
      image: imgHandling,
      step: "04"
    },
  ];

  return (
    <section className="w-full bg-white py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-inter text-3xl md:text-5xl font-bold text-[#2f3e2f] mb-4">
            Care for Your Craft
          </h2>
          <p className="font-inter text-gray-600 max-w-2xl mx-auto text-lg">
             Preserve the beauty and strength of your handcrafted pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((item, index) => (
            <div
              key={index}
              className="group relative h-[380px] md:h-[450px] w-[85%] md:w-full mx-auto rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-500"
            >
              {/* Background Image - Full Cover */}
              <div className="absolute inset-0">
                <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay: Dark at bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Content Positioned at Bottom */}
              <div className="absolute bottom-0 left-0 w-full p-8 text-white transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                 {/* Step Number with Line */}
                 <div className="flex items-center gap-3 mb-3 opacity-100">
                    <span className="text-sm font-mono tracking-widest uppercase text-[#fbbf24] font-bold">Step {item.step}</span>
                    <div className="h-px w-8 bg-[#fbbf24]"></div>
                 </div>

                 <h3 className="font-inter text-2xl font-bold mb-3 leading-tight">
                    {item.title}
                 </h3>
                 
                 {/* Description - Slides up/fades in slightly on hover interaction */}
                 <p className="font-inter text-sm text-gray-300 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {item.text}
                 </p>
                 
                 {/* Read More Hint (Mobile Only/Collapsed State) */}
                 <div className="mt-4 opacity-100 group-hover:opacity-0 transition-opacity duration-300 absolute bottom-8">
                     <span className="text-xs uppercase tracking-widest border-b border-white pb-1">Read Guidelines</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
