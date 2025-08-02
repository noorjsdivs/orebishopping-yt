import { useState, useEffect } from "react";
import { serverUrl } from "../../config.js";
import toast from "react-hot-toast";
import {
  FaFileInvoice,
  FaDownload,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheck,
  FaTimes,
  FaUser,
  FaCalendar,
  FaDollarSign,
  FaPrint,
  FaShare,
  FaSync,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

const Invoice = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  // Fetch all orders from database
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverUrl}/api/order/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and search orders
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userId?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.userId?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.address?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.address?.lastName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(
            (order) => new Date(order.date) >= filterDate
          );
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(
            (order) => new Date(order.date) >= filterDate
          );
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(
            (order) => new Date(order.date) >= filterDate
          );
          break;
      }
    }

    // Sort orders
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortConfig.key === "amount") {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length
        ? []
        : filteredOrders.map((order) => order._id)
    );
  };

  const generateInvoice = async (orderIds) => {
    try {
      const selectedOrdersData = orders.filter((order) =>
        orderIds.includes(order._id)
      );

      // Create invoice data
      const invoiceData = {
        invoiceNumber: `INV-${Date.now()}`,
        generatedDate: new Date().toISOString(),
        orders: selectedOrdersData,
        totalAmount: selectedOrdersData.reduce(
          (sum, order) => sum + order.amount,
          0
        ),
        itemCount: selectedOrdersData.reduce(
          (sum, order) => sum + order.items.length,
          0
        ),
      };

      setGeneratedInvoice(invoiceData);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const printInvoice = () => {
    // Add print styles
    const printStyles = `
      <style>
        @media print {
          body { margin: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:block { display: block !important; }
          @page { 
            margin: 0.5in; 
            size: A4;
          }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          .page-break { page-break-before: always; }
        }
      </style>
    `;

    // Get the invoice content
    const invoiceContent = document.getElementById("invoice-content");
    const originalContent = document.body.innerHTML;

    // Create print window
    document.body.innerHTML = printStyles + invoiceContent.outerHTML;
    window.print();

    // Restore original content after printing
    setTimeout(() => {
      document.body.innerHTML = originalContent;
      // Re-render React component
      window.location.reload();
    }, 1000);
  };

  const downloadInvoice = () => {
    // Create PDF download functionality here
    toast.success("Invoice download started");
  };

  const shareInvoice = () => {
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${generatedInvoice.invoiceNumber}`,
        text: `Invoice for ${generatedInvoice.orders.length} orders`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Invoice link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invoice Management
          </h1>
          <p className="text-gray-600">
            Generate invoices from customer orders
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaSync className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() =>
              selectedOrders.length > 0 && generateInvoice(selectedOrders)
            }
            disabled={selectedOrders.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaFileInvoice className="w-4 h-4" />
            Generate Invoice ({selectedOrders.length})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>
            <FaFileInvoice className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  orders.reduce((sum, order) => sum + order.amount, 0)
                )}
              </p>
            </div>
            <FaDollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedOrders.length}
              </p>
            </div>
            <FaCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Filtered</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredOrders.length}
              </p>
            </div>
            <FaFilter className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setDateFilter("all");
              setSelectedOrders([]);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedOrders.length === filteredOrders.length &&
                      filteredOrders.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("_id")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Order ID
                    {sortConfig.key === "_id" ? (
                      sortConfig.direction === "asc" ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      )
                    ) : (
                      <FaSort />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Date
                    {sortConfig.key === "date" ? (
                      sortConfig.direction === "asc" ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      )
                    ) : (
                      <FaSort />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Amount
                    {sortConfig.key === "amount" ? (
                      sortConfig.direction === "asc" ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      )
                    ) : (
                      <FaSort />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => handleSelectOrder(order._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUser className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.address?.firstName} {order.address?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.userId?.email || order.address?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(order.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FaFileInvoice className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && generatedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl max-h-[95vh] overflow-y-auto w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 print:hidden">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {generatedInvoice.invoiceNumber}
                </h2>
                <p className="text-gray-600">
                  Generated on{" "}
                  {new Date(
                    generatedInvoice.generatedDate
                  ).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={printInvoice}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                  title="Print Invoice"
                >
                  <FaPrint className="w-5 h-5" />
                </button>
                <button
                  onClick={downloadInvoice}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                  title="Download PDF"
                >
                  <FaDownload className="w-5 h-5" />
                </button>
                <button
                  onClick={shareInvoice}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                  title="Share Invoice"
                >
                  <FaShare className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="p-8 print:p-0" id="invoice-content">
              {/* Company Header */}
              <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-black">
                <div>
                  <h1 className="text-4xl font-bold text-black mb-2">OREBI</h1>
                  <div className="text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      <span>123 Business Street, Commerce City, CC 12345</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="w-4 h-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4" />
                      <span>contact@orebi.com</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-black mb-2">
                    INVOICE
                  </h2>
                  <div className="text-lg font-semibold text-gray-800">
                    {generatedInvoice.invoiceNumber}
                  </div>
                  <div className="text-gray-600 mt-2">
                    Date:{" "}
                    {new Date(
                      generatedInvoice.generatedDate
                    ).toLocaleDateString()}
                  </div>
                  <div className="text-gray-600">
                    Due Date:{" "}
                    {new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Bill To Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-bold text-black mb-3">
                    BILL TO:
                  </h3>
                  {generatedInvoice.orders.length > 0 && (
                    <div className="text-gray-700 space-y-1">
                      <div className="font-semibold">
                        {generatedInvoice.orders[0].address?.firstName}{" "}
                        {generatedInvoice.orders[0].address?.lastName}
                      </div>
                      <div>
                        {generatedInvoice.orders[0].userId?.email ||
                          generatedInvoice.orders[0].address?.email}
                      </div>
                      <div>
                        {generatedInvoice.orders[0].address?.street && (
                          <>
                            {generatedInvoice.orders[0].address.street}
                            <br />
                          </>
                        )}
                        {generatedInvoice.orders[0].address?.city &&
                          `${generatedInvoice.orders[0].address.city}, `}
                        {generatedInvoice.orders[0].address?.state &&
                          `${generatedInvoice.orders[0].address.state} `}
                        {generatedInvoice.orders[0].address?.zip}
                      </div>
                      {generatedInvoice.orders[0].address?.phone && (
                        <div>
                          Phone: {generatedInvoice.orders[0].address.phone}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black mb-3">
                    INVOICE SUMMARY:
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders Included:</span>
                      <span className="font-semibold">
                        {generatedInvoice.orders.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-semibold">
                        {generatedInvoice.itemCount}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Invoice Total:</span>
                      <span className="font-bold text-lg text-green-600">
                        {formatCurrency(generatedInvoice.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4">
                  ORDER DETAILS:
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left font-bold">
                          Order ID
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-bold">
                          Date
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-bold">
                          Items
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-bold">
                          Status
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-bold">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedInvoice.orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 font-mono text-sm">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <div className="space-y-1">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                  <span className="text-gray-600">
                                    {" "}
                                    × {item.quantity}
                                  </span>
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="text-sm text-gray-500">
                                  +{order.items.length - 3} more items
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                            {formatCurrency(order.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Items Breakdown */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4">
                  ITEMS BREAKDOWN:
                </h3>
                <div className="space-y-6">
                  {generatedInvoice.orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-sm text-gray-600 border-b">
                              <th className="text-left py-2">Item</th>
                              <th className="text-center py-2">Qty</th>
                              <th className="text-right py-2">Unit Price</th>
                              <th className="text-right py-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr
                                key={index}
                                className="text-sm border-b border-gray-100"
                              >
                                <td className="py-2 pr-4">
                                  <div className="font-medium text-gray-900">
                                    {item.name}
                                  </div>
                                  {item.description && (
                                    <div className="text-gray-500 text-xs mt-1">
                                      {item.description}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2 text-center">
                                  {item.quantity}
                                </td>
                                <td className="py-2 text-right">
                                  {formatCurrency(item.price)}
                                </td>
                                <td className="py-2 text-right font-semibold">
                                  {formatCurrency(item.price * item.quantity)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Section */}
              <div className="flex justify-end mb-8">
                <div className="w-full md:w-1/2">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal:</span>
                        <span className="font-semibold">
                          {formatCurrency(generatedInvoice.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Tax (0%):</span>
                        <span className="font-semibold">
                          {formatCurrency(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Shipping:</span>
                        <span className="font-semibold">Included</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-black">
                            TOTAL:
                          </span>
                          <span className="text-2xl font-bold text-green-600">
                            {formatCurrency(generatedInvoice.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-bold text-blue-900 mb-3">
                  PAYMENT INFORMATION:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <div className="font-semibold mb-2">Bank Transfer:</div>
                    <div>Bank: Orebi Business Bank</div>
                    <div>Account: 123-456-789</div>
                    <div>Routing: 987654321</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Payment Terms:</div>
                    <div>Net 30 days</div>
                    <div>Late fee: 1.5% per month</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-gray-500 text-sm border-t pt-6">
                <p className="mb-2">Thank you for your business!</p>
                <p>
                  This invoice was generated electronically and is valid without
                  signature.
                </p>
                <p className="mt-4">
                  Questions? Contact us at{" "}
                  <span className="text-blue-600">billing@orebi.com</span> or
                  call <span className="text-blue-600">+1 (555) 123-4567</span>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center print:hidden">
              <div className="text-lg font-bold text-gray-900">
                Grand Total: {formatCurrency(generatedInvoice.totalAmount)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={printInvoice}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaPrint className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={downloadInvoice}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaDownload className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
