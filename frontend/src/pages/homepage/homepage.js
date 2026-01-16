import { SEO } from "../../components/SEO/SEO";
import { HeroSection } from "./heroSection";

import { TestimonialsSection } from "./testimonialsSection";
import CategorySlider from "./categorySlider";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import FAQSection from "./faqSection";
import FooterSection from "../../components/footerSection";
import FeaturesBadges from "./FeaturesBadges";

import { FurnitureCareGuide } from "./FurnitureCareGuide";
import { WhyChooseUsSection } from "./whyChooseUsSection";

const Homepage = () => {
  return (
    <>
      <SEO 
        title="Handcrafted Wooden Furniture Online" 
        description="Shop premium handcrafted wooden furniture made by skilled artisans. Sustainable, durable, and timeless designs for modern homes."
        canonical="https://www.izhaiyam.com"
      />
      <HeroSection />
      <CategorySlider />
      <FeaturesBadges />
      <FeaturedProducts />
      <FurnitureCareGuide />
      <WhyChooseUsSection />
      <FAQSection />
      <TestimonialsSection />
      <FooterSection />
    </>
  );
};
export default Homepage;
