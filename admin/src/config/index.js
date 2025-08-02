// Admin Configuration
const ENV = import.meta.env.MODE || "development";

const config = {
  development: {
    API_BASE_URL: "http://localhost:3000",
    CLIENT_BASE_URL: "http://localhost:5173",
    ADMIN_BASE_URL: "http://localhost:5174",
    NODE_ENV: "development",
    DEBUG: true,
    LOG_LEVEL: "debug",
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
} = currentConfig;

// Legacy support for existing serverUrl import
export const serverUrl = API_BASE_URL;

// Environment check utilities
export const isDevelopment = ENV === "development";
export const isProduction = ENV === "production";

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
