import { FaBoxes, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { MdOutlineInventory, MdLowPriority } from "react-icons/md";

const Inventory = () => {
  const inventoryStats = [
    {
      title: "Total Products",
      value: "156",
      icon: <FaBoxes />,
      color: "blue",
    },
    {
      title: "Low Stock Items",
      value: "12",
      icon: <FaExclamationTriangle />,
      color: "yellow",
    },
    {
      title: "Out of Stock",
      value: "3",
      icon: <MdLowPriority />,
      color: "red",
    },
    {
      title: "In Stock",
      value: "141",
      icon: <FaCheckCircle />,
      color: "green",
    },
  ];

  const lowStockItems = [
    { name: "iPhone 14 Pro", stock: 5, threshold: 10 },
    { name: "MacBook Pro", stock: 2, threshold: 5 },
    { name: "iPad Air", stock: 8, threshold: 15 },
    { name: "Apple Watch", stock: 3, threshold: 10 },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Inventory Management
        </h1>
        <p className="text-gray-600">
          Monitor and manage your product inventory
        </p>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {inventoryStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}
              >
                {stat.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Low Stock Alert
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {lowStockItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    Threshold: {item.threshold} units
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-yellow-600">
                    {item.stock}
                  </span>
                  <p className="text-sm text-gray-600">units left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <MdOutlineInventory className="text-2xl text-gray-400 mb-2 mx-auto" />
              <p className="text-sm font-medium text-gray-600">
                Update Inventory
              </p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <FaBoxes className="text-2xl text-gray-400 mb-2 mx-auto" />
              <p className="text-sm font-medium text-gray-600">Bulk Import</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <FaCheckCircle className="text-2xl text-gray-400 mb-2 mx-auto" />
              <p className="text-sm font-medium text-gray-600">Stock Audit</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
