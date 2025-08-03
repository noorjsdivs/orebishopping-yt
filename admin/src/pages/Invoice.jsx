import { FaFileInvoice, FaLock, FaHeart } from "react-icons/fa";

const Invoice = () => {
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invoice Management
          </h1>
          <p className="text-gray-600">
            Generate professional invoices from customer orders
          </p>
        </div>
      </div>

      {/* Premium Message */}
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-sm p-12">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaLock className="text-3xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🔒 Premium Invoice Features
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Professional invoice generation, PDF exports, order management,
              and advanced billing features are available in the premium
              version.
            </p>
          </div>

          {/* Premium Features List */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-8 border border-amber-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              💎 Premium Invoice Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Professional invoice generation
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                PDF export & download
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Order filtering & search
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Bulk invoice creation
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Print & share functionality
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Detailed billing breakdown
              </div>
            </div>
            <div className="text-xs text-amber-700 bg-amber-100 px-3 py-2 rounded-full inline-block mt-4">
              ⚡ Complete admin panel • Professional invoices • Full source code
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="https://buymeacoffee.com/reactbd/e/442025"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          >
            <FaHeart className="text-xl" />
            Get Premium Access Now
          </a>

          <p className="text-sm text-gray-500 mt-6">
            Unlock professional invoice management and get the complete admin
            panel
          </p>

          {/* Demo Preview */}
          <div className="mt-12 p-6 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <FaFileInvoice className="text-blue-600" />
              Invoice Management Preview
            </h4>
            <div className="text-left text-sm text-gray-600 space-y-2">
              <div className="flex justify-between p-2 bg-white rounded border">
                <span>Order #12345678</span>
                <span className="text-green-600 font-semibold">$299.99</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded border">
                <span>Order #87654321</span>
                <span className="text-green-600 font-semibold">$459.50</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded border">
                <span>Order #45678912</span>
                <span className="text-green-600 font-semibold">$129.75</span>
              </div>
              <div className="text-center text-gray-400 py-4">
                + Professional invoice generation, PDF exports, and more...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
