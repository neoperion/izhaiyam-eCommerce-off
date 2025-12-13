import { HeroSection } from "./heroSection";
import { WhyChooseUsSection } from "./whyChooseUsSection";
import { TestimonialsSection } from "./testimonialsSection";
import CategorySlider from "./categorySlider";
import FeaturedProducts from "./featuredProducts";
import FAQSection from "./faqSection";
import FooterSection from "../../components/footerSection";

const Homepage = () => {
  return (
    <>
      <HeroSection />
      <CategorySlider />
      <FeaturedProducts />
      <TestimonialsSection />
      <FAQSection />
      <FooterSection />
    </>
  );
};
export default Homepage;
