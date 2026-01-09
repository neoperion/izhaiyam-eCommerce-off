import React from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { FaPinterest } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export const Footer = () => {
  const quickLinks = ["Cot & Beds", "Tables", "Chairs", "Dining", "Decor"];
  const categories = ["Cot Shop", "Cot Store", "Gift Shop", "Catalog"];
  const support = ["Contact Us", "FAQs", "Shipping", "Policies"];

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Newsletter Section - Stay Updated - Only on Home Page */}
      {isHomePage && (
        <section className="bg-[#FFF7F2]">
          <div className="container-page py-12 md:py-16">
            <div className="text-center max-w-3xl mx-auto">
              <p className="font-inter text-xs md:text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#93a267' }}>
                Newsletter
              </p>
              <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#93a267' }}>
                Stay Updated
              </h2>
              <p className="text-base md:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Subscribe for our newsletter for exclusive updates, new furniture trends, and timeless design tips
              </p>

              <form className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto items-center">
                <input
                  className="flex-1 w-full px-6 py-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93a267]"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 inline-flex items-center gap-2 whitespace-nowrap text-white"
                  style={{ backgroundColor: '#93a267' }}
                >
                  Subscribe
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>

              <p className="text-xs text-gray-600 mt-4">
                Subscribe to enjoy exclusive discounts and updates
              </p>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-primary text-primary-foreground">
        {/* Main Footer Content */}
        <div className="container-page py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              {/* Logo */}
              <Link to="/" className="mb-6 inline-block">
                <img
                  src={require("../../assets/logo.jpg")}
                  alt="Izhaiyam Logo"
                  className="h-16 md:h-20 w-auto object-contain mixes-blend-multiply rounded-lg"
                />
              </Link>

              <h3 className="font-inter text-lg md:text-xl font-bold tracking-tight mb-4 text-white">
                IZHAYAM HANDLOOM
              </h3>
              <p className="font-inter text-sm text-white/80 mb-6 leading-relaxed max-w-xs">
                Exceptional handwoven furniture pieces lovingly crafted with warmth and passion for your unique personal space.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#93a267] flex items-center justify-center transition-all duration-300 text-[#F5F5DC] hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#93a267] flex items-center justify-center transition-all duration-300 text-[#F5F5DC] hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#93a267] flex items-center justify-center transition-all duration-300 text-[#F5F5DC] hover:text-white"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#93a267] flex items-center justify-center transition-all duration-300 text-[#F5F5DC] hover:text-white"
                  aria-label="Pinterest"
                >
                  <FaPinterest className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h4 className="font-inter text-lg font-bold mb-6 text-white border-b border-white/30 pb-2 inline-block">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link}>
                    <Link to="/shop" className="font-inter text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h4 className="font-inter text-lg font-bold mb-6 text-white border-b border-white/30 pb-2 inline-block">Customer Support</h4>
              <ul className="space-y-3">
                {support.map((item) => (
                  <li key={item}>
                    <Link to="/contact" className="font-inter text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-span-2 lg:col-span-1 flex flex-col items-center text-center lg:items-start lg:text-left">
              <h4 className="font-inter text-lg font-bold mb-6 text-white border-b border-white/30 pb-2 inline-block">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-white/80 group hover:text-white transition-colors font-inter">
                  <MapPin className="w-5 h-5 text-[#F5F5DC] flex-shrink-0 mt-0.5" />
                  <span>123 Handloom Street, Textile District,<br />Tamil Nadu, India</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80 group hover:text-white transition-colors font-inter">
                  <Phone className="w-5 h-5 text-[#F5F5DC] flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80 group hover:text-white transition-colors font-inter">
                  <Mail className="w-5 h-5 text-[#F5F5DC] flex-shrink-0" />
                  <span>contact@izhayamfurniture.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>



        {/* Copyright Bar */}
        <div className="border-t border-primary-foreground/20">
          <div className="container-page py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-white/80 font-inter">
              <p>&copy; 2024 IZHAYAM HANDLOOM FURNITURE. All rights reserved.</p>
              <div className="flex gap-6">
                <Link to="/" className="hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/" className="hover:text-primary-foreground transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
