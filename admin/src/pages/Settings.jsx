import { FaCog, FaUser, FaDatabase, FaShield, FaBell } from "react-icons/fa";
import { MdSecurity, MdNotifications } from "react-icons/md";

const Settings = () => {
  const settingsCategories = [
    {
      title: "General Settings",
      icon: <FaCog />,
      color: "blue",
      settings: [
        { label: "Site Name", value: "Orebi Shopping", type: "text" },
        {
          label: "Site Description",
          value: "Modern e-commerce platform",
          type: "text",
        },
        { label: "Default Currency", value: "USD", type: "select" },
        { label: "Timezone", value: "UTC-5", type: "select" },
      ],
    },
    {
      title: "User Management",
      icon: <FaUser />,
      color: "green",
      settings: [
        { label: "Allow User Registration", value: true, type: "toggle" },
        { label: "Email Verification Required", value: true, type: "toggle" },
        { label: "Default User Role", value: "Customer", type: "select" },
        { label: "Password Minimum Length", value: "8", type: "number" },
      ],
    },
    {
      title: "Security",
      icon: <FaShield />,
      color: "red",
      settings: [
        { label: "Two-Factor Authentication", value: false, type: "toggle" },
        { label: "Session Timeout (minutes)", value: "30", type: "number" },
        { label: "Failed Login Attempts", value: "5", type: "number" },
        { label: "IP Whitelist Enabled", value: false, type: "toggle" },
      ],
    },
    {
      title: "Notifications",
      icon: <FaBell />,
      color: "purple",
      settings: [
        { label: "Email Notifications", value: true, type: "toggle" },
        { label: "Order Notifications", value: true, type: "toggle" },
        { label: "Low Stock Alerts", value: true, type: "toggle" },
        { label: "System Maintenance Alerts", value: false, type: "toggle" },
      ],
    },
  ];

  const renderSettingInput = (setting) => {
    switch (setting.type) {
      case "toggle":
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={setting.value}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        );
      case "select":
        return (
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>{setting.value}</option>
          </select>
        );
      case "number":
        return (
          <input
            type="number"
            defaultValue={setting.value}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
          />
        );
      default:
        return (
          <input
            type="text"
            defaultValue={setting.value}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your system configuration and preferences
        </p>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaDatabase className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-xs text-green-600">Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MdSecurity className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Security</p>
                <p className="text-xs text-blue-600">Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MdNotifications className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Notifications
                </p>
                <p className="text-xs text-purple-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="space-y-6">
        {settingsCategories.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                  <span className={`text-${category.color}-600`}>
                    {category.icon}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.title}
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {category.settings.map((setting, settingIndex) => (
                  <div
                    key={settingIndex}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {setting.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        Configure {setting.label.toLowerCase()}
                      </p>
                    </div>
                    {renderSettingInput(setting)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Settings */}
      <div className="mt-8 flex justify-end gap-4">
        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Reset to Defaults
        </button>
        <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
