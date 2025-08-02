import { FaDownload, FaCalendarAlt, FaFileExport } from "react-icons/fa";
import { MdAnalytics, MdTrendingUp } from "react-icons/md";

const Reports = () => {
  const reportTypes = [
    {
      title: "Sales Report",
      description: "Detailed sales analysis and revenue breakdown",
      icon: <MdTrendingUp />,
      color: "green",
      lastGenerated: "2 hours ago",
    },
    {
      title: "Inventory Report",
      description: "Stock levels, low inventory, and product performance",
      icon: <MdAnalytics />,
      color: "blue",
      lastGenerated: "1 day ago",
    },
    {
      title: "Customer Report",
      description: "Customer behavior, demographics, and engagement",
      icon: <MdAnalytics />,
      color: "purple",
      lastGenerated: "3 days ago",
    },
    {
      title: "Financial Report",
      description: "Revenue, expenses, and profit analysis",
      icon: <MdTrendingUp />,
      color: "orange",
      lastGenerated: "1 week ago",
    },
  ];

  const quickStats = [
    { label: "Total Reports Generated", value: "247" },
    { label: "This Month", value: "23" },
    { label: "Automated Reports", value: "12" },
    { label: "Custom Reports", value: "8" },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reports & Analytics
        </h1>
        <p className="text-gray-600">Generate and manage business reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {reportTypes.map((report, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg bg-${report.color}-100 text-${report.color}-600`}
              >
                {report.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {report.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {report.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Last generated: {report.lastGenerated}
                  </span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <FaCalendarAlt className="inline mr-1" />
                      Schedule
                    </button>
                    <button className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                      <FaDownload className="inline mr-1" />
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Reports
            </h3>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <FaFileExport className="inline mr-2" />
              Export All
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                name: "Monthly Sales Report - January 2025",
                date: "2025-01-15",
                size: "2.4 MB",
                type: "PDF",
              },
              {
                name: "Inventory Analysis - Q4 2024",
                date: "2025-01-10",
                size: "1.8 MB",
                type: "Excel",
              },
              {
                name: "Customer Behavior Report",
                date: "2025-01-05",
                size: "3.1 MB",
                type: "PDF",
              },
              {
                name: "Financial Summary - December",
                date: "2025-01-01",
                size: "1.2 MB",
                type: "PDF",
              },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <p className="text-sm text-gray-600">
                    {report.date} • {report.size} • {report.type}
                  </p>
                </div>
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaDownload className="inline mr-1" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
