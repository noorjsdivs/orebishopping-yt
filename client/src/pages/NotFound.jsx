import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { FaHome, FaSearch, FaArrowLeft } from "react-icons/fa";
import { MdError } from "react-icons/md";

const NotFound = () => {
  const popularLinks = [
    { name: "Shop All Products", path: "/shop" },
    { name: "About Us", path: "/about" },
    { name: "Contact Support", path: "/contact" },
    { name: "My Account", path: "/signin" },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center">
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          {/* Error Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center">
                  <MdError className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              The page you&apos;re looking for seems to have wandered off.
            </p>
            <p className="text-gray-500">
              Don&apos;t worry, even the best explorers get lost sometimes!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link to="/">
              <button className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold">
                <FaHome className="w-4 h-4" />
                Go Home
              </button>
            </Link>
            <Link to="/shop">
              <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                <FaSearch className="w-4 h-4" />
                Browse Products
              </button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 px-8 py-4 rounded-lg hover:text-gray-800 transition-colors font-semibold"
            >
              <FaArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </motion.div>

          {/* Popular Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="border-t border-gray-200 pt-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                >
                  <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 p-6 bg-gray-50 rounded-2xl"
          >
            <div className="text-4xl mb-4">🛍️</div>
            <p className="text-gray-600">
              <strong>Did you know?</strong> While you&apos;re here, over 1000
              customers are shopping on our site right now!
            </p>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
