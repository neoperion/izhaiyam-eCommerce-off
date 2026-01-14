import React from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { FaPinterest, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  const quickLinks = ["Cot & Beds", "Tables", "Chairs", "Dining", "Decor"];
  const categories = ["Cot Shop", "Cot Store", "Gift Shop", "Catalog"];
  const support = ["Contact Us", "FAQs", "Shipping", "Policies"];

  return (
    <>


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
                  href="https://www.facebook.com/rithanyahandicrafts.kayirukattil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#93a267] flex items-center justify-center transition-all duration-300 text-[#F5F5DC] hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/izhaiyam_handloom_furnitures/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#93a267] flex items-center justify-center transition-all duration-300 text-[#F5F5DC] hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
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
                  <span>6/4 GST Road Vallencery, Guduvanchery,<br />Tamil Nadu, India</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80 group hover:text-white transition-colors font-inter">
                  <Phone className="w-5 h-5 text-[#F5F5DC] flex-shrink-0" />
                  <span>+91 88256 03528</span>
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
              <p>&copy; 2026 IZHAYAM HANDLOOM FURNITURE. All rights reserved.</p>
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

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/918825603528?text=Want%20to%20know%20more%20about%20your%20products"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#93a267] hover:bg-[#2f3e2f] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
        style={{ boxShadow: "0 4px 20px rgba(147, 162, 103, 0.4)" }}
      >
        <FaWhatsapp className="w-8 h-8" />
      </a>
    </>
  );
};
