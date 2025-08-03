import { FaCrown, FaStar, FaTimes } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import PropTypes from "prop-types";

const PremiumModal = ({
  isOpen,
  onClose,
  title = "Premium Feature",
  description = "This feature is available in the premium version only.",
  features = [],
}) => {
  if (!isOpen) return null;

  const defaultFeatures = [
    "Advanced order management",
    "Detailed analytics & reports",
    "Priority customer support",
    "Custom branding options",
    "API access and integrations",
  ];

  const featureList = features.length > 0 ? features : defaultFeatures;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
              <FaCrown className="text-2xl text-yellow-300" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <HiSparkles className="text-lg" />
              <h2 className="text-2xl font-bold">{title}</h2>
              <HiSparkles className="text-lg" />
            </div>

            <p className="text-purple-100 text-sm">{description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Features */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaStar className="text-yellow-500" />
              <h3 className="font-semibold text-gray-900">What you get:</h3>
            </div>

            <ul className="space-y-3">
              {featureList.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://buymeacoffee.com/noorelahi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full justify-center"
            >
              <FaCrown className="text-lg" />
              <span>Unlock Premium</span>
              <HiSparkles className="text-lg" />
            </a>

            <p className="text-xs text-gray-500 mt-3">
              One-time purchase • Instant access • Lifetime updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

PremiumModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  features: PropTypes.array,
};

export default PremiumModal;
