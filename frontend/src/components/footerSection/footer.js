import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import fbIcon from "../../assets/fb.png";
import instaIcon from "../../assets/insta.png";
import threadsIcon from "../../assets/threads.png";
import cardsIcon from "../../assets/cards.png";
import paytmIcon from "../../assets/paytm.png";
import phonepeIcon from "../../assets/phonepe.png";
import razorpayIcon from "../../assets/razorpay.png";
import upiIcon from "../../assets/upi.png";
import gpayIcon from "../../assets/gpay.png";

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
                  className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <img src={fbIcon} alt="Facebook" className="w-full h-full object-contain" />
                </a>
                <a
                  href="https://www.instagram.com/izhaiyam_handloom_furnitures/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <img src={instaIcon} alt="Instagram" className="w-full h-full object-contain" />
                </a>
                <a
                  href="https://www.threads.com/@izhaiyam_handloom_furnitures?igshid=NTc4MTIwNjQ2YQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Threads"
                >
                  <img src={threadsIcon} alt="Threads" className="w-full h-full object-contain" />
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
        <div className="border-t border-primary-foreground/20 bg-black/8">
          <div className="container-page py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              {/* Security Trust Badge */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#000000]/20 flex items-center justify-center text-[#000000]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                </div>
                <div className="text-left">
                  <h5 className="font-playfair font-bold text-white text-sm">100% Secure Payments</h5>
                  <p className="font-inter text-xs text-white/60">Encrypted transactions & safe checkout</p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex flex-wrap justify-center items-center gap-4 transition-all duration-300">
        

                <img src={razorpayIcon} alt="Razorpay" className="h-20 object-contain" />
                <div className="h-6 w-px bg-white/20 hidden md:block mx-2"></div>

                <img src={upiIcon} alt="UPI" className="h-14 object-contain" />
                <img src={gpayIcon} alt="Google Pay" className="h-7 object-contain" />
                <img src={phonepeIcon} alt="PhonePe" className="h-9 object-contain" />
                <img src={paytmIcon} alt="Paytm" className="h-10 object-contain" />
                <div className="h-6 w-px bg-white/20 hidden md:block mx-2"></div>

                <img src={cardsIcon} alt="Cards" className="h-20 object-contain" />
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
