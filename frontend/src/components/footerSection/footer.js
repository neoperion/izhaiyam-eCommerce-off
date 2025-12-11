import React from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { FaPinterest } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  const quickLinks = ["Cot & Beds", "Tables", "Chairs", "Dining", "Decor"];
  const categories = ["Cot Shop", "Cot Store", "Gift Shop", "Catalog"];
  const support = ["Contact Us", "FAQs", "Shipping", "Policies"];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="container-page py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-4">
              IZHAYAM HANDLOOM FURNITURE
            </h3>
            <p className="text-sm text-primary-foreground/90 mb-6 leading-relaxed">
              Exceptional handwoven furniture pieces lovingly crafted with warmth and passion for your unique personal space.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterest className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-base md:text-lg mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to="/shop"
                    className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-base md:text-lg mb-4">Category</h4>
            <ul className="space-y-2.5">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to="/shop"
                    className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-base md:text-lg mb-4">Support</h4>
            <ul className="space-y-2.5">
              {support.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item === "Contact Us" ? "/contactUs" : "/"}
                    className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Info Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container-page py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-primary-foreground/90">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>123 Handloom Street, Dindigul District 624001</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>hello@izhaiyam.furniture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container-page py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-primary-foreground/80">
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
  );
};
