import React from "react";
import { ArrowRight } from "lucide-react";

export const Newsletter = () => {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container-page max-w-4xl">
        <div className="text-center">
          <p className="text-primary text-xs md:text-sm font-semibold tracking-widest uppercase mb-3">
            Newsletter
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Stay Updated
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe for our newsletter for exclusive updates, new furniture trends, and timeless design tips
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto items-center">
            <input
              className="flex-1 w-full px-6 py-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              type="email"
              placeholder="Enter your email"
              name="email"
              required
            />
            <button
              type="submit"
              className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-4">
            Subscribe to enjoy exclusive discounts and updates
          </p>
        </div>
      </div>
    </section>
  );
};
