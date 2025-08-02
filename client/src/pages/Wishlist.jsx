import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { FaHeart, FaShoppingBag, FaArrowLeft } from "react-icons/fa";

const Wishlist = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-8 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <FaHeart className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    My Wishlist
                  </h1>
                  <p className="text-gray-600">
                    Save your favorite items for later
                  </p>
                </div>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FaArrowLeft />
                Back to Profile
              </Link>
            </div>
          </motion.div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-12 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your wishlist by adding items you love. You can
              save items while browsing and come back to them later.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <FaShoppingBag />
              Start Shopping
            </Link>
          </motion.div>

          {/* Feature Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Save Favorites
              </h3>
              <p className="text-sm text-gray-600">
                Keep track of items you love and want to purchase later
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaShoppingBag className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Quick Purchase
              </h3>
              <p className="text-sm text-gray-600">
                Easily move items from wishlist to cart when ready to buy
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Never Forget</h3>
              <p className="text-sm text-gray-600">
                Your wishlist syncs across devices so you never lose your
                favorites
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default Wishlist;
