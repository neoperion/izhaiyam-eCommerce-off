import React from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { FaPinterest, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  const quickLinks = ["Cot & Beds", "Tables", "Chairs", "Dining", "Decor"];
  const categories = ["Cot Shop", "Cot Store", "Gift Shop", "Catalog"];
  const support = [
    { name: "Contact Us", link: "/contactUs" },
    { name: "Shipping Policy", link: "/shipping-policy" },
    { name: "Return & Refund", link: "/return-refund-policy" },
    { name: "Cancellation Policy", link: "/cancellation-policy" },
  ];

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
                  <li key={item.name}>
                    <Link to={item.link} className="font-inter text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.name}
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
                  <span>info@izhayam.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>



        {/* Secure Payment & Trust Badges */}
        <div className="border-t border-primary-foreground/20 bg-black/10">
          <div className="container-page py-6">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Security Trust Badge */}
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-[#93a267]/20 flex items-center justify-center text-[#93a267]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                   </div>
                   <div className="text-left">
                      <h5 className="font-playfair font-bold text-white text-sm">100% Secure Payments</h5>
                      <p className="font-inter text-xs text-white/60">Encrypted transactions & safe checkout</p>
                   </div>
                </div>

                {/* Payment Methods */}
                <div className="flex flex-wrap justify-center items-center gap-4">
                   <span className="font-inter text-xs text-white/50 hidden md:inline-block">Partenred with</span>
                   
                   {/* Razorpay Logo (Text Representation for clean look) */}
                   <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                      <span className="font-bold text-white tracking-tight border border-white/20 px-2 py-0.5 rounded text-sm bg-blue-900/40">Razorpay</span>
                   </div>

                   <div className="h-6 w-px bg-white/20 hidden md:block"></div>

                   {/* Icons Row */}
                   <div className="flex items-center gap-3 text-white/80">
                      {/* Visa */}
                      <div className="flex flex-col items-center gap-1" title="Visa">
                         <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                         <span className="text-[9px] font-inter uppercase tracking-wide opacity-60">Cards</span>
                      </div>
                      
                      {/* UPI */}
                      <div className="flex flex-col items-center gap-1" title="UPI">
                         <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                         <span className="text-[9px] font-inter uppercase tracking-wide opacity-60">UPI</span>
                      </div>

                      {/* Netbanking */}
                      <div className="flex flex-col items-center gap-1" title="Netbanking">
                         <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90"><path d="M3 21h18"/><path d="M5 21v-7"/><path d="M19 21v-7"/><path d="M5 10a5 5 0 0 1 14 0"/><path d="M12 10v4"/></svg>
                         <span className="text-[9px] font-inter uppercase tracking-wide opacity-60">NetBanking</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-primary-foreground/20">
          <div className="container-page py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-white/80 font-inter">
              <p>&copy; 2026 IZHAYAM HANDLOOM FURNITURE. All rights reserved.</p>
              <div className="flex gap-6">
                <Link to="/privacy-policy" className="hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms-and-conditions" className="hover:text-primary-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link to="/data-deletion" className="hover:text-primary-foreground transition-colors">
                  Data Deletion
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
