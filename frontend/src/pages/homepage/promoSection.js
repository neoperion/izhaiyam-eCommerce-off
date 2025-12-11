import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bedroomImg from "../../assets/bedRoomCategory.jpg";
import livingRoomImg from "../../assets/livingRoomCategory.jpg";

export const PromoSection = () => {
  const navigate = useNavigate();

  const promos = [
    {
      title: "Premium Dining Collection",
      label: "New Arrivals",
      image: livingRoomImg,
      cta: "Explore Collection",
      bgGradient: "from-foreground/50 via-foreground/20 to-transparent",
    },
    {
      title: "Bedroom Essentials",
      label: "Up to 30% Off",
      image: bedroomImg,
      cta: "Shop Now",
      bgGradient: "from-foreground/50 via-foreground/20 to-transparent",
    },
  ];

  return (
    <section className="section-padding bg-card">
      <div className="container-page">
        <div className="grid md:grid-cols-2 gap-6">
          {promos.map((promo, index) => (
            <article
              key={index}
              className="group relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
              onClick={() => navigate("/shop")}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] md:min-h-[400px] overflow-hidden">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${promo.bgGradient}`} />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="text-primary-foreground/80 text-sm md:text-base font-semibold tracking-widest uppercase mb-2">
                    {promo.label}
                  </p>
                  <h3 className="text-primary-foreground font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                    {promo.title}
                  </h3>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary-foreground text-foreground rounded-lg font-semibold hover:bg-primary-foreground/90 transition-all group-hover:gap-3">
                    {promo.cta}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
