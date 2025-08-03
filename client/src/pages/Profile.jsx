import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../../config";
import { addUser, removeUser, resetOrderCount } from "../redux/orebiSlice";
import Container from "../components/Container";
import { FaSignOutAlt, FaUserCircle, FaCog, FaHeart } from "react-icons/fa";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
      return;
    }

    // Fetch fresh user data from server
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${serverUrl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const userData = response.data.user;
          // Update Redux store with fresh data
          dispatch(addUser(userData));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, [userInfo, navigate, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(removeUser());
    dispatch(resetOrderCount());
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!userInfo) {
    return null;
  }

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
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center">
                  <FaUserCircle className="text-4xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {userInfo.name}!
                  </h1>
                  <p className="text-gray-600">
                    Manage your account and preferences
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </motion.div>

          {/* Premium Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-16"
          >
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-12">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCog className="text-3xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  🔒 Premium Profile Features
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Access to profile editing, order history, wishlist management,
                  and advanced account features is available in the premium
                  version of this code.
                </p>
              </div>

              {/* Premium Features List */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-8 border border-amber-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                  💎 What&apos;s Included in Premium
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Profile editing & management
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Order history & tracking
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Wishlist functionality
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Account statistics
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Quick action shortcuts
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Enhanced user experience
                  </div>
                </div>
                <div className="text-xs text-amber-700 bg-amber-100 px-3 py-2 rounded-full inline-block mt-4">
                  ⚡ One-time payment • Lifetime access • Complete source code
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
                Unlock all profile features and get the complete source code
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
