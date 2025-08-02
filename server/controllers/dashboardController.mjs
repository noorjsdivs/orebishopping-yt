import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Verify admin role (additional check even though middleware handles it)
    if (req.user.role !== "admin") {
      return res.json({
        success: false,
        message: "Admin access required for dashboard statistics",
      });
    }

    // Get counts in parallel
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      userModel.countDocuments(),
      productModel.countDocuments(),
      orderModel.countDocuments(),
    ]);

    // Calculate total revenue from delivered/shipped orders
    const revenueResult = await orderModel.aggregate([
      { $match: { status: { $in: ["delivered", "shipped", "confirmed"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get recent orders (last 5)
    const recentOrders = await orderModel
      .find({})
      .populate("userId", "name email")
      .sort({ date: -1 })
      .limit(5);

    // Get top products (you can enhance this with actual sales data)
    const topProducts = await productModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(5);

    // Get orders by status
    const ordersByStatus = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent users (last 5)
    const recentUsers = await userModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    // Calculate growth percentages (mock data - you can implement real calculation)
    const stats = {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      topProducts,
      recentUsers,
      ordersByStatus,
      growth: {
        products: 12, // +12%
        orders: 8, // +8%
        users: 15, // +15%
        revenue: 23, // +23%
      },
    };

    res.json({
      success: true,
      stats,
      message: "Dashboard statistics fetched successfully",
    });
  } catch (error) {
    console.log("Get Dashboard Stats Error:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get analytics data for charts
const getAnalytics = async (req, res) => {
  try {
    // Verify admin role (additional check even though middleware handles it)
    if (req.user.role !== "admin") {
      return res.json({
        success: false,
        message: "Admin access required for analytics data",
      });
    }

    const { period = "6months" } = req.query;

    let dateFilter = new Date();
    if (period === "6months") {
      dateFilter.setMonth(dateFilter.getMonth() - 6);
    } else if (period === "1year") {
      dateFilter.setFullYear(dateFilter.getFullYear() - 1);
    } else {
      dateFilter.setMonth(dateFilter.getMonth() - 3); // 3 months default
    }

    // Monthly orders and revenue
    const monthlyData = await orderModel.aggregate([
      { $match: { date: { $gte: dateFilter } } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // User registrations over time
    const userRegistrations = await userModel.aggregate([
      { $match: { createdAt: { $gte: dateFilter } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          users: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      analytics: {
        monthlyData,
        userRegistrations,
        period,
      },
      message: "Analytics data fetched successfully",
    });
  } catch (error) {
    console.log("Get Analytics Error:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get quick stats for sidebar
const getQuickStats = async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== "admin") {
      return res.json({
        success: false,
        message: "Admin access required for quick statistics",
      });
    }

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Today's sales (sum of today's order amounts)
    const todaysSalesResult = await orderModel.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lt: endOfDay },
          status: { $in: ["delivered", "shipped", "confirmed", "pending"] },
        },
      },
      { $group: { _id: null, totalSales: { $sum: "$amount" } } },
    ]);

    const todaysSales =
      todaysSalesResult.length > 0 ? todaysSalesResult[0].totalSales : 0;

    // Today's new orders count
    const todaysOrders = await orderModel.countDocuments({
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    res.json({
      success: true,
      quickStats: {
        todaysSales,
        todaysOrders,
      },
      message: "Quick statistics fetched successfully",
    });
  } catch (error) {
    console.log("Get Quick Stats Error:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { getDashboardStats, getAnalytics, getQuickStats };
