import React from "react";
import { Newsletter } from "./Newsletter";
import { Footer } from "./footer";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  return (
    <section className="lg:row-span-1 lg:col-span-full">
      {isHomePage && <Newsletter />}
      <Footer />
    </section>
  );
};

export default Index;
