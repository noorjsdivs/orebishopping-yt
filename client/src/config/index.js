// Client Configuration
const ENV = import.meta.env.MODE || "development";

const config = {
  development: {
    API_BASE_URL: "http://localhost:3000",
    CLIENT_BASE_URL: "http://localhost:5173",
    ADMIN_BASE_URL: "http://localhost:5174",
    NODE_ENV: "development",
    DEBUG: true,
    LOG_LEVEL: "debug",
    // Payment configurations for development
    STRIPE_PUBLISHABLE_KEY:
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_DEV || "",
    PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID_DEV || "",
    // Other development specific configs
    ENABLE_ANALYTICS: false,
    CACHE_DURATION: 300000, // 5 minutes
  },
  production: {
    API_BASE_URL:
      import.meta.env.VITE_API_BASE_URL || "https://your-api-domain.com",
    CLIENT_BASE_URL:
      import.meta.env.VITE_CLIENT_BASE_URL || "https://orebiclient.reactbd.com",
    ADMIN_BASE_URL:
      import.meta.env.VITE_ADMIN_BASE_URL || "https://orebiadmin.reactbd.com",
    NODE_ENV: "production",
    DEBUG: false,
    LOG_LEVEL: "error",
    // Payment configurations for production
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
    PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID || "",
    // Other production specific configs
    ENABLE_ANALYTICS: true,
    CACHE_DURATION: 3600000, // 1 hour
  },
};

// Export the configuration based on current environment
const currentConfig = config[ENV] || config.development;

export const {
  API_BASE_URL,
  CLIENT_BASE_URL,
  ADMIN_BASE_URL,
  NODE_ENV,
  DEBUG,
  LOG_LEVEL,
  STRIPE_PUBLISHABLE_KEY,
  PAYPAL_CLIENT_ID,
  ENABLE_ANALYTICS,
  CACHE_DURATION,
} = currentConfig;

// Legacy support for existing serverUrl import
export const serverUrl = API_BASE_URL;

// Environment check utilities
export const isDevelopment = ENV === "development";
export const isProduction = ENV === "production";

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/api/user/login",
    REGISTER: "/api/user/register",
    PROFILE: "/api/user/profile",
    LOGOUT: "/api/user/logout",
    REFRESH: "/api/user/refresh-token",
  },
  // Product endpoints
  PRODUCTS: {
    LIST: "/api/product/list",
    DETAIL: "/api/product",
    CATEGORIES: "/api/category",
    BRANDS: "/api/brand",
    SEARCH: "/api/product/search",
  },
  // Order endpoints
  ORDERS: {
    CREATE: "/api/order/create",
    LIST: "/api/order/list",
    DETAIL: "/api/order",
    UPDATE: "/api/order/update",
  },
  // Payment endpoints
  PAYMENT: {
    STRIPE: "/api/payment/stripe",
    PAYPAL: "/api/payment/paypal",
    COD: "/api/payment/cod",
  },
};

// Logger utility
export const logger = {
  debug: (...args) => {
    if (DEBUG) {
      console.log("[DEBUG]", ...args);
    }
  },
  info: (...args) => {
    if (DEBUG || LOG_LEVEL === "info") {
      console.info("[INFO]", ...args);
    }
  },
  warn: (...args) => {
    console.warn("[WARN]", ...args);
  },
  error: (...args) => {
    console.error("[ERROR]", ...args);
  },
};

export default currentConfig;
