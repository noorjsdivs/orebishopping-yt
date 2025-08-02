import { useState } from "react";
import { FaMapMarkerAlt, FaDirections, FaPhone, FaClock } from "react-icons/fa";

// Fallback Interactive Map Component (avoiding react-leaflet render2 error)
const InteractiveMap = () => {
  const [showDirections, setShowDirections] = useState(false);

  // Coordinates for Broadway Street, New York
  const position = [40.8176, -73.9482];
  const address = "3065 Broadway Street, New York, NY 10027, United States";

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      address
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openInAppleMaps = () => {
    const url = `http://maps.apple.com/?daddr=${encodeURIComponent(address)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-white">
      {/* Static Map Image with Store Location */}
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-green-100">
        {/* Map Placeholder with Store Info */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-shop+ff0000(${position[1]},${position[0]})/${position[1]},${position[0]},15,0/400x300@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw)`,
          }}
        />

        {/* Store Marker Overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <FaMapMarkerAlt className="text-4xl text-red-600 drop-shadow-lg" />
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-max">
              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                Orebi Shopping
              </p>
            </div>
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 space-y-2">
          <button
            onClick={() => setShowDirections(!showDirections)}
            className="bg-white rounded-lg shadow-md p-2 hover:shadow-lg transition-shadow"
            title="Get Directions"
          >
            <FaDirections className="text-blue-600" />
          </button>
        </div>
      </div>

      {/* Store Information Panel */}
      <div className="p-6 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              Orebi Shopping
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-green-500 flex-shrink-0" />
                <span>(415) 225-0123</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-blue-500 flex-shrink-0" />
                <div>
                  <div>Mon-Fri: 9:00 AM - 8:00 PM</div>
                  <div>Sat-Sun: 10:00 AM - 6:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Direction Buttons */}
        {showDirections && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Get Directions:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={openInGoogleMaps}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaDirections />
                Google Maps
              </button>
              <button
                onClick={openInAppleMaps}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition-colors"
              >
                <FaDirections />
                Apple Maps
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
