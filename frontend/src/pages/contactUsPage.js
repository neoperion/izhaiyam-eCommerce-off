import { useState } from "react";
import { Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import FooterSection from "../components/footerSection";
import contactImage from "../assets/image.png";

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
      // Simulate form submission - replace with actual backend integration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* TOPIC SECTION - About IZHAYAM */}
        <section className="py-16 px-4" style={{ backgroundColor: '#FFF7F2' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="font-inter text-center text-3xl font-bold mb-12" style={{ color: '#93a267' }}>
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
                <h3 className="font-inter text-xl md:text-2l font-extrabold mb-6 leading-tight text-gray-900">
                  <span className="text-3xl md:text-4xl mr-2" style={{ color: '#93a267' }}>IZHAYAM</span> Handcrafted Furniture
                </h3>
                <p className="font-nunito text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                  "  Experience the finest handcrafted wooden furniture with traditional Tamil Nadu designs.
                </p>
                <p className="font-nunito text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                  Visit our showroom to explore custom solutions and personalized design consultations for your dream home.
                </p>
                <p className="font-nunito text-base md:text-lg text-gray-700 leading-relaxed">
                  Each piece is crafted with care by skilled artisans, celebrating our rich heritage and bringing warmth to your living spaces. "
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAP & CONTACT INFO SECTION */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-inter text-center text-3xl font-bold mb-12" style={{ color: '#93a267' }}>
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
                  className="absolute bottom-6 right-6 font-inter px-6 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
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
                  className="font-inter text-xl font-bold text-gray-800 mb-8"
                >
                  Get in Touch
                </motion.h3>

                <div className="space-y-6">
                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#93a267' }}>
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-inter text-sm font-semibold text-gray-600">Email</span>
                    </div>
                    <a
                      href="mailto:contact@izhayamfurniture.com"
                      className="font-inter text-gray-700 text-sm ml-13 hover:text-[#93a267] transition-colors"
                    >
                      contact@izhayamfurniture.com
                    </a>
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#93a267' }}>
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-inter text-sm font-semibold text-gray-600">Phone</span>
                    </div>
                    <a
                      href="tel:+919876543210"
                      className="font-inter text-gray-700 text-sm ml-13 hover:text-[#93a267] transition-colors"
                    >
                      +91 98765 43210
                    </a>
                  </motion.div>

                  {/* Address */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#93a267' }}>
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-inter text-sm font-semibold text-gray-600">Address</span>
                    </div>
                    <p className="font-inter text-gray-700 text-sm ml-13">
                      123 Handloom Street, Textile District, Tamil Nadu, India
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
            <h2 className="font-inter text-center text-3xl font-bold mb-12" style={{ color: '#93a267' }}>
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
                    <label htmlFor="name" className="font-inter block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="font-inter w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent bg-white transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="font-inter block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="font-inter w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent bg-white transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="font-inter block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="font-inter w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent bg-white transition-all"
                      placeholder="Inquiry about dining tables"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="font-inter block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="font-inter w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent resize-none bg-white transition-all"
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
                    className="font-inter w-full text-white font-bold py-3 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
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
