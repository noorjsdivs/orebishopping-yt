import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { FaUsers, FaGlobe, FaAward, FaHeart } from "react-icons/fa";
import { MdSecurity, MdLocalShipping, MdSupport } from "react-icons/md";

const stats = [
  { number: "50K+", label: "Happy Customers", icon: <FaUsers /> },
  { number: "100+", label: "Countries Served", icon: <FaGlobe /> },
  { number: "5 Years", label: "Industry Experience", icon: <FaAward /> },
  { number: "99%", label: "Customer Satisfaction", icon: <FaHeart /> },
];

const values = [
  {
    icon: <MdSecurity />,
    title: "Trust & Security",
    description:
      "Your security is our priority. We use industry-leading encryption and security measures to protect your data and transactions.",
  },
  {
    icon: <MdLocalShipping />,
    title: "Fast & Reliable",
    description:
      "Quick delivery and reliable service. We partner with trusted shipping providers to ensure your orders arrive on time.",
  },
  {
    icon: <MdSupport />,
    title: "Customer First",
    description:
      "24/7 customer support and hassle-free returns. Our dedicated team is always here to help you with any questions or concerns.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Orebi Shopping
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              We&apos;re passionate about bringing you the best shopping
              experience with quality products, exceptional service, and
              unbeatable prices. Discover why millions trust us for their
              shopping needs.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">{stat.icon}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2019, Orebi Shopping began with a simple mission:
                  to make quality products accessible to everyone, everywhere.
                  What started as a small online store has grown into a trusted
                  marketplace serving customers across the globe.
                </p>
                <p>
                  We believe that shopping should be more than just a
                  transaction – it should be an experience that delights and
                  inspires. That&apos;s why we carefully curate our product
                  selection, partner with reliable suppliers, and invest in
                  cutting-edge technology to ensure every interaction with our
                  platform is seamless.
                </p>
                <p>
                  Today, we&apos;re proud to serve over 50,000 happy customers
                  worldwide, offering everything from the latest fashion trends
                  to innovative gadgets, all backed by our commitment to
                  quality, affordability, and exceptional customer service.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl text-white">🛍️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Quality First
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Every product is carefully selected
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do and shape the
              experience we create for our customers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">{value.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Join thousands of satisfied customers and discover why Orebi
              Shopping is the preferred choice for online shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <button className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                  Shop Now
                </button>
              </Link>
              <Link to="/contact">
                <button className="px-8 py-4 border border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-semibold">
                  Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default About;
