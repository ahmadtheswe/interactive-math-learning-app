// Environment configuration and validation
export const env = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  APP_TITLE: import.meta.env.VITE_APP_TITLE || "Interactive Math Learning App",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  NODE_ENV: import.meta.env.NODE_ENV || "development",
  isDevelopment: import.meta.env.NODE_ENV === "development",
  isProduction: import.meta.env.NODE_ENV === "production",
} as const;

// Validate required environment variables
const requiredEnvVars = ["VITE_API_BASE_URL"] as const;

export function validateEnvironment(): void {
  const missing = requiredEnvVars.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(", ")}. Using defaults.`
    );
  }
}

// Validate on import
if (env.isDevelopment) {
  validateEnvironment();
}

export default env;
