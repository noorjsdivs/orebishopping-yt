import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../redux/authSlice";
import { serverUrl } from "../../config.js";
import { IoMdAdd } from "react-icons/io";
import {
  FaList,
  FaUsers,
  FaBox,
  FaChevronDown,
  FaChevronRight,
  FaFileInvoice,
  FaSignOutAlt,
  FaTags,
  FaBook,
  FaEnvelope,
  FaSync,
} from "react-icons/fa";
import { MdDashboard, MdAnalytics, MdInventory } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { HiOutlineClipboardList } from "react-icons/hi";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({
    Products: false,
  });
  const [quickStats, setQuickStats] = useState({
    todaysSales: 0,
    todaysOrders: 0,
    loading: true,
    error: false,
    lastUpdated: null,
  });

  // Fetch quick stats
  const fetchQuickStats = async () => {
    try {
      setQuickStats((prev) => ({ ...prev, loading: true, error: false }));

      const token = localStorage.getItem("token");
      if (!token) {
        setQuickStats((prev) => ({ ...prev, loading: false, error: true }));
        return;
      }

      const response = await fetch(`${serverUrl}/api/dashboard/quick-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setQuickStats({
          todaysSales: data.quickStats.todaysSales,
          todaysOrders: data.quickStats.todaysOrders,
          loading: false,
          error: false,
          lastUpdated: new Date(),
        });
      } else {
        setQuickStats((prev) => ({ ...prev, loading: false, error: true }));
      }
    } catch (error) {
      console.error("Error fetching quick stats:", error);
      setQuickStats((prev) => ({ ...prev, loading: false, error: true }));
    }
  };

  useEffect(() => {
    fetchQuickStats();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchQuickStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sidebarItems = [
    {
      title: "Overview",
      icon: <MdDashboard />,
      path: "/",
      description: "Dashboard overview",
      badge: null,
    },
    {
      title: "Analytics",
      icon: <MdAnalytics />,
      path: "/analytics",
      description: "View analytics & insights",
      badge: "New",
    },
    {
      title: "Products",
      icon: <BiPackage />,
      path: "#",
      isCategory: true,
      children: [
        {
          title: "Add Product",
          icon: <IoMdAdd />,
          path: "/add",
          description: "Add new products",
        },
        {
          title: "Product List",
          icon: <FaList />,
          path: "/list",
          description: "Manage all products",
        },
        {
          title: "Inventory",
          icon: <MdInventory />,
          path: "/inventory",
          description: "Stock management",
        },
        {
          title: "Categories",
          icon: <FaTags />,
          path: "/categories",
          description: "Manage categories",
        },
        {
          title: "Brands",
          icon: <FaBox />,
          path: "/brands",
          description: "Manage brands",
        },
      ],
    },
    {
      title: "Orders",
      icon: <HiOutlineClipboardList />,
      path: "/orders",
      description: "Manage customer orders",
      badge: null,
    },
    {
      title: "Users",
      icon: <FaUsers />,
      path: "/users",
      description: "User management",
    },
    {
      title: "Contacts",
      icon: <FaEnvelope />,
      path: "/contacts",
      description: "Customer messages & support",
      badge: null,
    },
    {
      title: "API Docs",
      icon: <FaBook />,
      path: "/api-docs",
      description: "API documentation",
      badge: "📚",
    },
    {
      title: "Invoice",
      icon: <FaFileInvoice />,
      path: "/invoice",
      description: "Generate & manage invoices",
    },
  ];

  const renderNavItem = (item, isChild = false) => {
    if (item.isCategory) {
      const isExpanded = expandedCategories[item.title];

      return (
        <div key={item.title} className="mb-2">
          <button
            onClick={() => toggleCategory(item.title)}
            className="w-full flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 mx-1 sm:mx-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-base sm:text-lg transition-transform group-hover:scale-110 flex-shrink-0">
                {item.icon}
              </span>
              <span className="hidden sm:inline-flex font-medium truncate">
                {item.title}
              </span>
            </div>
            <span className="hidden sm:inline-flex flex-shrink-0">
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </span>
          </button>
          <div
            className={`ml-3 sm:ml-4 space-y-1 transition-all duration-300 overflow-hidden ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {item.children?.map((child) => renderNavItem(child, true))}
          </div>
        </div>
      );
    }

    return (
      <NavLink
        key={item.title}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 mx-1 sm:mx-2 rounded-lg transition-all duration-200 group ${
            isActive
              ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg"
              : "text-gray-700 hover:bg-gray-50 hover:text-black"
          } ${isChild ? "text-sm" : ""}`
        }
        title={item.description}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <span
            className={`${
              isChild ? "text-sm sm:text-base" : "text-base sm:text-lg"
            } transition-transform group-hover:scale-110 flex-shrink-0`}
          >
            {item.icon}
          </span>
          <div className="hidden sm:flex flex-col min-w-0 flex-1">
            <span
              className={`font-medium truncate ${isChild ? "text-sm" : ""}`}
            >
              {item.title}
            </span>
            {!isChild && (
              <span className="text-xs text-gray-400 group-hover:text-gray-600 truncate">
                {item.description}
              </span>
            )}
          </div>
        </div>
        {item.badge && (
          <span className="hidden lg:inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full flex-shrink-0">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <div className="w-full bg-white border-r border-gray-200 flex flex-col overflow-x-hidden">
      {/* Logo/Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-black to-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
            <FaBox className="text-white text-sm sm:text-lg" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-lg sm:text-xl text-gray-900">
              Orebi Admin
            </h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Dashboard Active
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-3 sm:p-4 border-b border-gray-100 hidden lg:block flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-500">Quick Overview</div>
          <button
            onClick={fetchQuickStats}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh data"
          >
            <FaSync className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 p-2 rounded-lg">
            <div className="text-xs text-blue-600 font-medium">
              Today&apos;s Sales
            </div>
            <div className="text-sm font-bold text-blue-800">
              {quickStats.loading ? (
                <div className="animate-pulse bg-blue-200 h-4 w-12 rounded"></div>
              ) : quickStats.error ? (
                <span className="text-red-500">--</span>
              ) : (
                formatCurrency(quickStats.todaysSales)
              )}
            </div>
          </div>
          <div className="bg-green-50 p-2 rounded-lg">
            <div className="text-xs text-green-600 font-medium">New Orders</div>
            <div className="text-sm font-bold text-green-800">
              {quickStats.loading ? (
                <div className="animate-pulse bg-green-200 h-4 w-8 rounded"></div>
              ) : quickStats.error ? (
                <span className="text-red-500">--</span>
              ) : (
                quickStats.todaysOrders
              )}
            </div>
          </div>
        </div>
        {quickStats.lastUpdated && !quickStats.loading && (
          <div className="text-center mt-2">
            <span className="text-xs text-gray-400">
              Updated:{" "}
              {quickStats.lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-2 sm:py-4 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1 px-1 sm:px-0">
          {sidebarItems.map((item) => renderNavItem(item))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
        {/* User Info */}
        {/* {user && (
          <div className="hidden sm:flex items-center gap-3 mb-3 p-2 bg-white rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-semibold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        )} */}

        {/* Logout Button */}
        <div className="mb-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 group"
          >
            <FaSignOutAlt className="text-sm sm:text-base group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>

        {/* System Status */}
        <div className="text-center text-xs text-gray-400">
          <div className="hidden sm:block">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span>System Healthy</span>
            </div>
            <p className="text-gray-500">© 2025 Orebi Admin v1.0.0</p>
          </div>
          <div className="sm:hidden flex flex-col items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
