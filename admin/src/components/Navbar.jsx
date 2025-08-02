import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { logo } from "../assets/images";
import { FaUser, FaCog, FaChevronDown, FaUserShield } from "react-icons/fa";
import { MdNotifications, MdDashboard } from "react-icons/md";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getUserInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const notifications = [
    { id: 1, title: "New order received", time: "2 min ago", type: "order" },
    { id: 2, title: "Low stock alert", time: "1 hour ago", type: "warning" },
    { id: 3, title: "User registration", time: "3 hours ago", type: "user" },
  ];

  const userMenuItems = [
    { icon: FaUser, label: "Profile", path: "/profile" },
    { icon: MdDashboard, label: "Dashboard", path: "/" },
    { icon: FaCog, label: "Settings", path: "/settings" },
  ];

  return (
    <header className="border-b border-gray-200 w-full sticky top-0 left-0 z-40 bg-white shadow-sm">
      <div className="py-2.5 flex items-center justify-between px-4">
        {/* Logo Section */}
        <Link to={"/"} className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="logo"
            className="w-20 sm:w-24 transition-transform duration-200 group-hover:scale-105"
          />
          <div className="hidden sm:block">
            <p className="text-xs uppercase font-bold tracking-wide text-blue-600">
              Admin Panel
            </p>
            <p className="text-xs text-gray-500">Dashboard v1.0</p>
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Admin Badge */}
          <div className="hidden md:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
            <FaUserShield className="text-blue-600 text-sm" />
            <span className="text-sm font-medium text-blue-700">Admin</span>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
            >
              <MdNotifications className="text-xl" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {notifications.length}
              </span>
            </button>

            {/* Notifications Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500">
                    {notifications.length} new notifications
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          {user && (
            <div className="relative" ref={userMenuRef}>
              {/* User Info - Desktop */}
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-3 text-sm text-gray-600 mr-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>

                {/* User Avatar & Dropdown */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors duration-200"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-semibold text-sm">
                      {getUserInitials(user?.name || user?.email)}
                    </div>
                  )}
                  <FaChevronDown
                    className={`text-gray-600 text-sm transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {/* User Info in Dropdown */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.name || user.email}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {userMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <item.icon className="text-gray-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
