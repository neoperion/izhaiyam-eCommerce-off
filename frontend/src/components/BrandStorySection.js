import React, { useRef } from 'react';
import { 
  ThermometerSun, 
  Heart, 
  Baby, 
  Moon, 
  User, 
  Activity, 
  Leaf, 
  Smile, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import wellnessLifestyleImg from '../assets/wellness_lifestyle.png';
import ropeDetailImg from '../assets/rope_detail.png';

const BrandStorySection = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const benefits = [
    {
      title: "Natural Cooling",
      desc: "Breathable weave keeps you cool.",
      icon: <ThermometerSun size={24} className="text-[#93a267]" />,
      color: "bg-orange-50"
    },
    {
      title: "Circulation",
      desc: "Even support reduces pressure.",
      icon: <Heart size={24} className="text-[#93a267]" />,
      color: "bg-red-50"
    },
    {
      title: "Better Sleep",
      desc: "Deeper rest with natural comfort.",
      icon: <Moon size={24} className="text-[#93a267]" />,
      color: "bg-indigo-50"
    },
    {
      title: "Posture Support",
      desc: "Aligns spine naturally.",
      icon: <User size={24} className="text-[#93a267]" />,
      color: "bg-blue-50"
    },
    {
      title: "Digestion Aid",
      desc: "Ergonomic seating angle.",
      icon: <Smile size={24} className="text-[#93a267]" />,
      color: "bg-green-50"
    },
    {
      title: "Pain Relief",
      desc: "Alleviates back tension.",
      icon: <Activity size={24} className="text-[#93a267]" />,
      color: "bg-pink-50"
    },
    {
      title: "Child Safe",
      desc: "Hypoallergenic cotton material.",
      icon: <Baby size={24} className="text-[#93a267]" />,
      color: "bg-yellow-50"
    },
    {
      title: "Eco Friendly",
      desc: "Sustainable & biodegradable.",
      icon: <Leaf size={24} className="text-[#93a267]" />,
      color: "bg-emerald-50"
    }
  ];

  return (
    <section className="w-full py-16 lg:py-24 bg-white overflow-hidden relative">
      {/* Background Texture Accent - Subtle */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
         <img src={ropeDetailImg} alt="Texture" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Mobile Layout: Stacked with Horizontal Scroll */}
        <div className="lg:hidden">
          <div className="mb-8">
            <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-3">
              Wellness in <span className="text-[#93a267]">Every Weave</span>
            </h2>
            <p className="font-inter text-gray-600 text-sm leading-relaxed">
              Traditional designs reimagined for modern health. Experience the natural benefits of handwoven rope furniture.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg mb-8 aspect-[4/3]">
            <img src={wellnessLifestyleImg} alt="Wellness Lifestyle" className="w-full h-full object-cover" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {benefits.map((item, idx) => (
              <div 
                key={idx}
                className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center text-center transition-all active:scale-95"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-[#93a267]/10 text-[#93a267]">
                  {React.cloneElement(item.icon, { size: 22, className: "text-[#93a267]", strokeWidth: 1.5 })}
                </div>
                <h3 className="font-playfair font-bold text-gray-900 text-[0.95rem] mb-1">{item.title}</h3>
                <p className="font-inter text-[11px] text-gray-500 leading-snug opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Desktop Layout: Bento Grid */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
          
          {/* Main Visual - Spans 5 columns */}
          <div className="col-span-5 relative h-full min-h-[600px]">
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img src={wellnessLifestyleImg} alt="Wellness Lifestyle" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="w-12 h-1 bg-[#93a267] mb-4"></div>
                <h3 className="font-playfair text-3xl font-bold mb-2">Designed for Wellness</h3>
                <p className="font-inter text-white/90 text-sm">
                  Our chairs conform to your body, providing natural ergonomic support that rigid furniture simply cannot match.
                </p>
              </div>
            </div>
            {/* Floating Texture Card */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-3 hover:rotate-0 transition-all duration-300">
                <img src={ropeDetailImg} alt="Detail" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Content & Grid - Spans 7 columns */}
          <div className="col-span-7 pl-8">
            <h2 className="font-playfair text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Why Your Body Loves <br/><span className="text-[#93a267]">Handwoven Rope</span>
            </h2>
            <p className="font-inter text-gray-600 text-lg mb-10 max-w-xl">
              Beyond aesthetics, our traditional rope weave is engineered for health. It allows your skin to breathe and your spine to align naturally.
            </p>

            <div className="grid grid-cols-2 gap-5">
              {benefits.map((item, idx) => (
                <div 
                  key={idx}
                  className="group flex p-4 rounded-xl border border-gray-100 hover:border-[#93a267]/30 hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors ${item.color} group-hover:bg-[#93a267] group-hover:bg-opacity-10`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default BrandStorySection;
