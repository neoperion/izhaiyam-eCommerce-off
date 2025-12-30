import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import FooterSection from "../components/footerSection";
import heroAbout from "../assets/heroabout.JPG";
import newsImage from "../assets/news.png";
import founderImage from "../assets/IMG_0207 (1).jpg";
import CircularGallery from "../components/CircularGallery/CircularGallery";

// Import award images
import award1 from "../assets/award1.jpg";
import award2 from "../assets/award2.jpeg";
import award3 from "../assets/award3.jpg";
import award4 from "../assets/award4.jpg";

export const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section
        className="relative w-full h-96 bg-cover flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroAbout})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top'
        }}
      >
        {/* Transparency Overlay */}
        <div className="absolute inset-0 bg-white bg-opacity-30"></div>

        {/* Content - Explore Button */}
        <div className="text-center z-10 relative">
          <button
            className="font-inter px-8 py-3 text-white font-semibold tracking-wider rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: '#93a267' }}
          >
            ABOUT US
          </button>
        </div>
      </section>

      {/* Our Articles Section */}
      <section className="w-full bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-20">Our Articles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
            {/* Left Column - Text */}
            <div className="flex items-start pt-8">
              <div className="text-left">
                <p className="font-inter text-base font-light text-gray-700 leading-relaxed">
                  Furniture is more than a functional element in a home—it is an expression of culture, comfort, and craftsmanship. Our brand was founded with the belief that well-made furniture should carry a story, a purpose, and a soul. We bring together traditional techniques and contemporary design to create furniture that is timeless, meaningful, and built to last.
                  <br /><br />
                  Each piece in our collection is thoughtfully handcrafted by skilled artisans who have inherited their knowledge through generations. Their hands shape raw materials into refined forms, paying close attention to detail, balance, and durability. From the initial design to the final polish, every stage of the process reflects patience, precision, and pride in workmanship. We do not believe in mass production; instead, we value quality over quantity and authenticity over shortcuts.
                  <br /><br />
                  At the heart of our work is a strong commitment to empowering artisans, especially women craftsmen who play a vital role in preserving traditional art forms. By providing fair opportunities, a supportive work environment, and consistent demand for their skills, we help sustain livelihoods while keeping heritage craftsmanship alive. When you choose our furniture, you are not just purchasing a product—you are supporting a community and a legacy.
                  <br /><br />
                  Our designs are inspired by everyday living. We focus on creating furniture that is both aesthetically pleasing and highly functional. Clean lines, balanced proportions, and natural materials define our style, making our pieces suitable for modern homes while still retaining a warm, traditional essence. Whether it is a chair, a table, or a handcrafted décor piece, each product is designed to seamlessly blend into your space and enhance your daily life.
                  <br /><br />
                  Quality is central to everything we do. We carefully source materials that are durable, sustainable, and responsibly selected. Our furniture is built to withstand time, usage, and changing trends. Rigorous quality checks ensure that every product meets our standards before reaching your home, so you can trust in its strength, finish, and comfort.
                </p>
              </div>
            </div>

            {/* Right Column - Article Preview */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={newsImage}
                alt="Article Preview"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Founder Section */}
      <section className="w-full bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-20">Our Founders</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            {[
              { name: "Founder Name 1", role: "Co-Founder & CEO" },
              { name: "Founder Name 2", role: "Co-Founder & Creative Director" }
            ].map((founder, i) => (
              <div key={i} className="text-center">
                <div className="rounded-lg w-96 h-96 mb-8 overflow-hidden mx-auto">
                  <img
                    src={founderImage}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-inter text-2xl font-light text-gray-800">{founder.name}</p>
                <p className="font-inter text-sm text-gray-500 mt-2">{founder.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="w-full bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-20">Our Vision</h2>


          {/* Vision Box */}
          <div className="bg-orange-50 rounded-lg p-12 max-w-xl w-full mx-auto mb-12">
            <h3 className="font-inter text-5xl font-light text-gray-800 mb-6 leading-tight">
              Our<br />Vision
            </h3>
            <p className="font-inter text-sm text-gray-700 leading-relaxed">
              A world with healthier<br />
              lifestyle<br />
              and to retain traditional<br />
              craft from<br />
              disappearing
            </p>
          </div>

          {/* Benefits Box */}
          <div className="bg-gray-900 text-white p-12 max-w-xl w-full text-center rounded-lg mx-auto">
            <h3 className="font-inter text-3xl font-light leading-relaxed">
              Health<br />
              benefits of<br />
              rope<br />
              furniture
            </h3>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-16">Why Choose Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Handcrafted Excellence */}
            <div className="flex gap-6 items-start p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-inter text-xl font-semibold text-gray-800 mb-3">Handcrafted Excellence</h3>
                <p className="font-inter text-sm text-gray-600 leading-relaxed">
                  Every piece is meticulously crafted by skilled artisans using traditional techniques passed down through generations, ensuring unparalleled quality and attention to detail.
                </p>
              </div>
            </div>

            {/* Artisan Empowerment */}
            <div className="flex gap-6 items-start p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-inter text-xl font-semibold text-gray-800 mb-3">Artisan Empowerment</h3>
                <p className="font-inter text-sm text-gray-600 leading-relaxed">
                  We are committed to supporting local artisans, especially women craftsmen, by providing fair wages and sustainable employment opportunities.
                </p>
              </div>
            </div>

            {/* Premium Quality */}
            <div className="flex gap-6 items-start p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-inter text-xl font-semibold text-gray-800 mb-3">Premium Quality Materials</h3>
                <p className="font-inter text-sm text-gray-600 leading-relaxed">
                  We carefully source durable, sustainable materials and conduct rigorous quality checks to ensure every product meets our high standards.
                </p>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="flex gap-6 items-start p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-inter text-xl font-semibold text-gray-800 mb-3">Customer Satisfaction</h3>
                <p className="font-inter text-sm text-gray-600 leading-relaxed">
                  Your satisfaction is our priority. We offer transparent pricing, honest communication, and reliable support from browsing to delivery and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Awards Section */}
      <section className="w-full bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-20">Our Awards</h2>

          {/* 3D Circular Gallery */}
          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery
              items={[
                { image: founderImage, text: 'Founder' },
                { image: award1, text: 'Award 2024' },
                { image: award2, text: 'Excellence' },
                { image: award3, text: 'Innovation' },
                { image: award4, text: 'Achievement' }
              ]}
              bend={0}
              borderRadius={0.05}
              scrollEase={0.01}
              textColor="#93a267"
              font="bold 24px Inter"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};
