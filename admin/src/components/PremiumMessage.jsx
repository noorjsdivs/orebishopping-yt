import { FaCrown, FaStar, FaRocket, FaGift } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import PropTypes from "prop-types";

const PremiumMessage = ({
  title = "Premium Feature",
  description = "This feature is available in the premium version only.",
  features = [],
  showDemoPreview = false,
}) => {
  const defaultFeatures = [
    "Advanced analytics and reporting",
    "Unlimited orders and invoices",
    "Priority customer support",
    "Custom branding options",
    "API access and integrations",
    "Advanced user management",
  ];

  const featureList = features.length > 0 ? features : defaultFeatures;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Premium Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-full mb-6 shadow-2xl">
            <FaCrown className="text-4xl text-white" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <HiSparkles className="text-2xl text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <HiSparkles className="text-2xl text-purple-600" />
          </div>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Feature List */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <FaStar className="text-2xl text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Premium Features
              </h2>
            </div>

            <ul className="space-y-4">
              {featureList.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Upgrade Benefits */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <FaRocket className="text-2xl" />
              <h2 className="text-2xl font-bold">Why Upgrade?</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FaGift className="text-2xl text-yellow-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Full Access</h3>
                  <p className="text-purple-100">
                    Unlock all premium features and capabilities
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <HiSparkles className="text-2xl text-yellow-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Support Development
                  </h3>
                  <p className="text-purple-100">
                    Help us continue improving and adding new features
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaStar className="text-2xl text-yellow-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Priority Support
                  </h3>
                  <p className="text-purple-100">
                    Get faster responses and dedicated assistance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Preview */}
        {showDemoPreview && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Preview of Premium Features
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <FaCrown className="text-4xl mx-auto mb-4 text-yellow-500" />
                <p className="text-lg font-medium">
                  Interactive Demo Available in Premium
                </p>
                <p className="text-sm mt-2">
                  Get instant access to all features and capabilities
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 inline-block">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Upgrade?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Support the development and get access to all premium features
            </p>

            <a
              href="https://buymeacoffee.com/noorelahi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <FaCrown className="text-xl" />
              <span className="text-lg">Buy Me a Coffee & Unlock Premium</span>
              <HiSparkles className="text-xl" />
            </a>

            <p className="text-sm text-gray-500 mt-4">
              One-time purchase • Instant access • Lifetime updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

PremiumMessage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  features: PropTypes.array,
  showDemoPreview: PropTypes.bool,
};

export default PremiumMessage;
