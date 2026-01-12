import { HeroSection } from "./heroSection";

import { TestimonialsSection } from "./testimonialsSection";
import CategorySlider from "./categorySlider";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import FAQSection from "./faqSection";
import FooterSection from "../../components/footerSection";
import FeaturesBadges from "./FeaturesBadges";

const Homepage = () => {
  return (
    <>
      <HeroSection />
      <CategorySlider />
      <FeaturesBadges />
      <FeaturedProducts />
      <FAQSection />

      <TestimonialsSection />
      <FooterSection />
    </>
  );
};
export default Homepage;
