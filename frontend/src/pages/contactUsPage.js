import { useState } from "react";
import { SEO } from "../components/SEO/SEO";
import { Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import FooterSection from "../components/footerSection";
import contactImage from "../assets/image.png";
import axios from "axios";
import { toast } from "react-toastify";

export const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // API Call to Backend
      // Base URL is likely proxied or set in axios defaults, but we'll use relative path
      // If deployed, ensure access to correct backend URL. 
      // Assuming proxy is set up in package.json or axios global config.
      // If not, we might need `${process.env.REACT_APP_BACKEND_URL}/api/v1/contact`
      // For now, using relative path `/api/v1/contact` which works with proxy.
      
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v1/contact`, formData);

      if (response.status === 200) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        toast.success("Message sent successfully!");
        
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      setSubmitStatus("error");
      toast.error(error.response?.data?.msg || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us - Visit Our Showroom"
        description="Get in touch with Izhaiyam Handloom Furniture. Visit our showroom in Tamil Nadu or contact us for custom orders. +91 98765 43210."
        canonical="https://www.izhaiyam.com/contactUs"
        data={{
          "@context": "https://schema.org",
          "@type": "FurnitureStore",
          "name": "Izhaiyam Handloom Furniture",
          "image": "https://www.izhaiyam.com/static/media/image.png",
          "url": "https://www.izhaiyam.com",
          "telephone": "+919876543210",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Handloom Street",
            "addressLocality": "Textile District",
            "addressRegion": "Tamil Nadu",
            "addressCountry": "IN"
          }
        }}
      />
      <div className="min-h-screen bg-white">
        {/* TOPIC SECTION - About IZHAYAM */}
        <section className="py-16 px-4" style={{ backgroundColor: '#FFF7F2' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="font-inter text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12" style={{ color: '#93a267' }}>
              Let’s Build Your Dream Space
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left - Image (Half of webpage) */}
              <div className="w-full">
                <img
                  src={contactImage}
                  alt="IZHAYAM Furniture Showroom"
                  className="w-full h-96 md:h-[500px] object-cover rounded-lg shadow-xl"
                />
              </div>

              {/* Right - Content (Premium finish, no background box) */}
              <div className="flex flex-col justify-center px-4 md:px-8">
                <h3 className="font-inter text-xl md:text-2xl lg:text-3xl font-extrabold mb-4 md:mb-6 leading-tight text-gray-900">
                  <span className="text-2xl md:text-4xl mr-2" style={{ color: '#93a267' }}>IZHAYAM</span> Handcrafted Furniture
                </h3>
                <p className="font-inter text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-4">
                  " Experience the finest handcrafted wooden furniture with traditional Tamil Nadu designs.
                </p>
                <p className="font-inter text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-4">
                  Visit our showroom to explore custom solutions and personalized design consultations for your dream home.
                </p>
                <p className="font-inter text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
                  Each piece is crafted with care by skilled artisans, celebrating our rich heritage and bringing warmth to your living spaces. "
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAP & CONTACT INFO SECTION */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-inter text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12" style={{ color: '#93a267' }}>
              Visit Our Showroom
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Left - Map with Button Overlay */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="group relative rounded-lg shadow-md overflow-hidden h-96"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.5234567890!2d80.0509629!3d12.8376466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f700141c167d%3A0x4015c0c38910032c!2sIzhaiyam%20Handloom%20Furniture!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="IZHAYAM Furniture Location"
                ></iframe>

                {/* Visit Our Shop Button - Shows on Hover */}
                <a
                  href="https://www.google.com/maps/place/Izhaiyam+Handloom+Furniture/@12.8376466,80.0509629,17z/data=!3m1!4b1!4m6!3m5!1s0x3a52f700141c167d:0x4015c0c38910032c!8m2!3d12.8376414!4d80.0535378!16s%2Fg%2F11zkp1hk1p?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 right-6 font-inter px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                  style={{ backgroundColor: '#93a267' }}
                >
                  Visit Our Shop →
                </a>
              </motion.div>

              {/* Right - Contact Info with Enhanced Animations */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6 }}
                className="p-8 rounded-lg shadow-lg h-96 flex flex-col justify-center"
                style={{ backgroundColor: '#FFF7F2' }}
              >
                <motion.h3
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-inter text-lg md:text-xl font-bold text-gray-800 mb-6 md:mb-8"
                >
                  Get in Touch
                </motion.h3>

                <div className="space-y-4 md:space-y-6">
                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3 mb-1 md:mb-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#93a267' }}>
                        <Mail className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <span className="font-inter text-xs md:text-sm font-semibold text-gray-600">Email</span>
                    </div>
                    <a
                      href="mailto:orders@izhayam.com"
                      className="font-inter text-gray-700 text-sm md:text-base ml-11 md:ml-13 hover:text-[#93a267] transition-colors"
                    >
                      orders@izhayam.com
                    </a>
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3 mb-1 md:mb-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#93a267' }}>
                        <Phone className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <span className="font-inter text-xs md:text-sm font-semibold text-gray-600">Phone</span>
                    </div>
                    <a
                      href="tel:+918825603528"
                      className="font-inter text-gray-700 text-sm md:text-base ml-11 md:ml-13 hover:text-[#93a267] transition-colors"
                    >
                      +91 88256 03528
                    </a>
                  </motion.div>

                  {/* Address */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3 mb-1 md:mb-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#93a267' }}>
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <span className="font-inter text-xs md:text-sm font-semibold text-gray-600">Address</span>
                    </div>
                    <p className="font-inter text-gray-700 text-sm md:text-base ml-11 md:ml-13">
                      6/4 GST Road Vallencery, Guduvanchery, Tamil Nadu, India
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CONTACT FORM SECTION */}
        <section className="py-16 px-4" style={{ backgroundColor: '#FFF7F2' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="font-inter text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12" style={{ color: '#93a267' }}>
              Send Us a Message
            </h2>

            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg p-10 border border-gray-200"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="font-inter block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="font-inter w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent bg-white transition-all"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="font-inter block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="font-inter w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent bg-white transition-all"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="font-inter block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="font-inter w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent bg-white transition-all"
                      placeholder="Inquiry about dining tables"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="font-inter block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="font-inter w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent resize-none bg-white transition-all"
                      placeholder="Tell us about your furniture needs..."
                    ></textarea>
                  </div>

                  {/* Status Messages */}
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-inter text-sm font-medium">
                        Thank you! We'll get back to you soon.
                      </span>
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-inter"
                    >
                      Something went wrong. Please try again.
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="font-inter w-full text-white font-bold py-2.5 md:py-3 rounded-lg text-sm md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ backgroundColor: '#93a267' }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <span>Send Message →</span>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <FooterSection />
    </>
  );
};

export default ContactUsPage;
