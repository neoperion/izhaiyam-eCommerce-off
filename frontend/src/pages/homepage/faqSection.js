import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What materials do you use for your furniture?",
      answer: "We primarily use cotton rope, solid wood, MS frames, and eco-friendly finishes. All materials are selected for durability, comfort, and sustainability."
    },
    {
      question: "Is the rope used durable and safe?",
      answer: "Yes. Our cotton ropes are tightly woven, breathable, and highly durable. They are safe for daily use and free from harmful chemicals."
    },
    {
      question: "Do you take custom orders?",
      answer: "Absolutely! We offer customization in sizes, colors, materials, and finishes to match your space and theme."
    },
    {
      question: "Is rope furniture suitable for outdoor use?",
      answer: "Yes. We offer both indoor and outdoor rope furniture. For outdoor setups, we use weather-resistant materials and ropes designed to withstand exposure."
    },
    {
      question: "Do you deliver outside Chennai?",
      answer: "Yes. We deliver across India. Delivery options and charges vary by location."
    },
    {
      question: "How long does it take to manufacture an order?",
      answer: "Depending on the product and quantity, the general manufacturing timeframe ranges from 7 to 30 days."
    },
    {
      question: "How do I maintain rope furniture?",
      answer: "Rope furniture is low-maintenance. Simple vacuuming or wiping with a dry cloth keeps it clean. For outdoor models, occasional dusting is enough."
    },
    {
      question: "Do you offer bulk orders for commercial spaces?",
      answer: "Yes. We handle bulk orders for cafés, restaurants, resorts, farmhouses, and dhabas."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleAccordion(index);
    }
  };

  return (
    <section
      className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8"
      style={{ backgroundColor: '#f9f5f0' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <p
            className="font-inter text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2 sm:mb-3"
            style={{ color: '#93a267' }}
          >
            NEED HELP?
          </p>
          <h2
            className="font-inter text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
            style={{
              color: '#2c2c2c'
            }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our handcrafted furniture
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleAccordion(index)}
                onKeyDown={(e) => handleKeyPress(e, index)}
                className="w-full text-left px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex justify-between items-center gap-4 transition-colors duration-200"
                style={{
                  backgroundColor: openIndex === index ? '#faf8f5' : 'white',
                  outline: 'none',
                  border: openIndex === index ? '1px solid #93a26720' : '1px solid transparent'
                }}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span
                  className="text-sm sm:text-base md:text-lg font-semibold pr-2"
                  style={{ color: '#2c2c2c' }}
                >
                  {faq.question}
                </span>
                <div
                  className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: openIndex === index ? '#93a267' : '#e8e4df',
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                >
                  <ChevronDown
                    size={16}
                    className="sm:w-5 sm:h-5"
                    style={{
                      color: openIndex === index ? 'white' : '#93a267'
                    }}
                  />
                </div>
              </button>

              {/* Answer Panel */}
              <div
                id={`faq-answer-${index}`}
                className="overflow-hidden transition-all ease-in-out"
                style={{
                  maxHeight: openIndex === index ? '500px' : '0',
                  opacity: openIndex === index ? 1 : 0,
                  transitionDuration: '200ms'
                }}
              >
                <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-5 md:pb-6 pt-0">
                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: '#93a267' }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-8 sm:mt-12 md:mt-16 text-center">
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Still have questions?
          </p>
          <a
            href="/contactUs"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: '#93a267',
              color: 'white'
            }}
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
