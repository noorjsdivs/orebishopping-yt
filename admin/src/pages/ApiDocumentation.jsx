import { useState } from "react";
import { serverUrl } from "../../config";
import { FaBook, FaExternalLinkAlt, FaCode, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";

const ApiDocumentation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const openApiDocs = () => {
    const docsUrl = `${serverUrl}/api/docs/html`;
    window.open(docsUrl, "_blank", "noopener,noreferrer");
  };

  const downloadApiDocs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${serverUrl}/api/docs`);
      if (response.ok) {
        const data = await response.json();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "orebi-api-documentation.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("API documentation downloaded successfully!");
      } else {
        toast.error("Failed to download API documentation");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download API documentation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="xl:max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBook className="text-2xl text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              API Documentation
            </h1>
            <p className="text-gray-600 mb-6">
              Complete documentation for the Orebi E-commerce API
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <FaExternalLinkAlt className="text-xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  View Documentation
                </h3>
                <p className="text-sm text-gray-600">
                  Interactive HTML documentation
                </p>
              </div>
            </div>
            <button
              onClick={openApiDocs}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FaExternalLinkAlt />
              Open Documentation
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <FaDownload className="text-xl text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Download JSON
                </h3>
                <p className="text-sm text-gray-600">
                  Raw API documentation data
                </p>
              </div>
            </div>
            <button
              onClick={downloadApiDocs}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <FaDownload />
              {isLoading ? "Downloading..." : "Download JSON"}
            </button>
          </div>
        </div>

        {/* API Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaCode className="text-blue-600" />
            API Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">🔐</div>
              <div className="text-sm font-medium text-gray-900">
                Authentication
              </div>
              <div className="text-xs text-gray-600">JWT Token Based</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">👥</div>
              <div className="text-sm font-medium text-gray-900">
                User Management
              </div>
              <div className="text-xs text-gray-600">CRUD Operations</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">📦</div>
              <div className="text-sm font-medium text-gray-900">Products</div>
              <div className="text-xs text-gray-600">Catalog Management</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">🛒</div>
              <div className="text-sm font-medium text-gray-900">Orders</div>
              <div className="text-xs text-gray-600">Order Processing</div>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Reference
          </h2>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
              <h3 className="font-semibold text-gray-900">Base URL</h3>
              <code className="text-sm text-gray-700 bg-white px-2 py-1 rounded">
                {serverUrl}
              </code>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg">
              <h3 className="font-semibold text-gray-900">
                Authentication Header
              </h3>
              <code className="text-sm text-gray-700 bg-white px-2 py-1 rounded">
                token: your-jwt-token
              </code>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 rounded-r-lg">
              <h3 className="font-semibold text-gray-900">Content Type</h3>
              <code className="text-sm text-gray-700 bg-white px-2 py-1 rounded">
                Content-Type: application/json
              </code>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">💡 Quick Tip</h3>
            <p className="text-sm text-yellow-700">
              Use the interactive HTML documentation for detailed endpoint
              information, request/response examples, and testing capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
