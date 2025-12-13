import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'About', href: '/aboutUs' },
  { name: 'Contact', href: '/contactUs' },
];

export const NavTabs = ({ isMobile, setDisplayVerticalNavBar }) => {
  const location = useLocation();

  const getLinkClasses = (isActive) => {
    if (isMobile) {
      return `px-4 py-3 rounded-lg text-2xl font-semibold transition-colors ${
        isActive
          ? 'bg-primary-foreground/20 text-primary-foreground'
          : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground'
      }`;
    }
    return `text-base font-semibold transition-colors duration-200 ${
      isActive
        ? 'text-primary-foreground border-b-2 border-primary-foreground pb-1'
        : 'text-primary-foreground/80 hover:text-primary-foreground'
    }`;
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            onClick={() => setDisplayVerticalNavBar && setDisplayVerticalNavBar(false)}
            className={getLinkClasses(location.pathname === link.href)}
          >
            {link.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-12">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.href}
          className={getLinkClasses(location.pathname === link.href)}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};
