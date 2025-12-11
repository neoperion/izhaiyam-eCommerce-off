import React from "react";
import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5.0,
      avatar: "PS",
      quote: "The handcrafted quality of IZHAYAM furniture is exceptional. Each piece tells a story and adds warmth to our home. The attention to detail in the weaving is simply stunning.",
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 4.9,
      avatar: "RK",
      quote: "I was amazed by the durability and comfort of my handloom sofa. It's been over a year and it still looks as good as new. Traditional craftsmanship at its finest!",
    },
    {
      name: "Anita Patel",
      location: "Bangalore",
      rating: 5.0,
      avatar: "AP",
      quote: "IZHAYAM truly celebrates our heritage. The furniture pieces are not just functional but works of art. Every guest admires the unique handwoven patterns.",
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "fill-amber-600 text-amber-600"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-primary text-xs md:text-sm font-semibold tracking-widest uppercase mb-3">
            What Our Customers Say
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Testimonials
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Customer Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">{renderStars(testimonial.rating)}</div>
                <span className="text-sm font-semibold text-foreground">
                  {testimonial.rating.toFixed(1)}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-muted-foreground italic leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
