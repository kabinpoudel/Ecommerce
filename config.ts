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
}

export const envConfig: IEnvConfig = {
  port: process.env.PORT,
  dburl: process.env.DATABASE_URL,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  otpThreshold: process.env.OTP_THRESHOLD,
};
