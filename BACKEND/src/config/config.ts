import { config } from "dotenv";

config();

interface IEnvConfig {
  port: number;
  dburl: string;
  jwtSecretKey: string;
  jwtExpiresIn: string;
  email: string;
  password: string;
  otpThreshold: number;
  adminEmail: string;
  adminPassword: string;
  adminUserName: string;
}

// Helper function to get required env variable (throws error if missing)
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Helper function to parse number from env (with fallback)
function getNumberEnv(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return num;
}

export const envConfig: IEnvConfig = {
  port: getNumberEnv("PORT", 3000), // Default to 3000 if not set
  dburl: getRequiredEnv("DATABASE_URL"),
  jwtSecretKey: getRequiredEnv("JWT_SECRET_KEY"),
  jwtExpiresIn: getRequiredEnv("JWT_EXPIRES_IN"),
  email: getRequiredEnv("EMAIL"),
  password: getRequiredEnv("PASSWORD"),
  otpThreshold: getNumberEnv("OTP_THRESHOLD"), // Default to 5 if not set
  adminEmail: getRequiredEnv("ADMIN_EMAIL"),
  adminPassword: getRequiredEnv("ADMIN_PASSWORD"),
  adminUserName: getRequiredEnv("ADMIN_USERNAME"),
};
