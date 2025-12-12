import { HeroSection } from "./heroSection";
import { WhyChooseUsSection } from "./whyChooseUsSection";
import { TestimonialsSection } from "./testimonialsSection";
import CategorySlider from "./categorySlider";
import FeaturedProducts from "./featuredProducts";
import FooterSection from "../../components/footerSection";

const Homepage = () => {
  return (
    <>
      <HeroSection />
      <CategorySlider />
      <FeaturedProducts />
      <TestimonialsSection />
      <FooterSection />
    </>
  );
};
export default Homepage;
