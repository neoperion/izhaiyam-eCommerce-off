import { HeroSection } from "./heroSection";
import { WhyChooseUsSection } from "./whyChooseUsSection";
import ProductsSection from "./productsSection";
import { PromoSection } from "./promoSection";
import { TestimonialsSection } from "./testimonialsSection";
import FooterSection from "../../components/footerSection";

const Homepage = () => {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <PromoSection />
      <TestimonialsSection />
      <FooterSection />
    </>
  );
};
export default Homepage;
