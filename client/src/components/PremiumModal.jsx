import { motion } from "framer-motion";
import { FaLock, FaGift, FaTimes } from "react-icons/fa";

const PremiumModal = ({
  isOpen,
  onClose,
  title = "Premium Feature",
  description = "This feature is available in the premium version.",
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <FaLock className="text-2xl text-white" />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">🔒 {title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

          {/* Premium Access Info */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6 border border-amber-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              💎 Premium Access Required
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Get instant access to the complete source code and unlock all
              functionality.
            </p>
            <div className="text-xs text-amber-700 bg-amber-100 px-3 py-1 rounded-full inline-block">
              ⚡ One-time payment • Lifetime access
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <a
              href="https://buymeacoffee.com/reactbd/e/442025"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaGift className="text-lg" />
              Get Premium Access Now
            </a>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PremiumModal;
