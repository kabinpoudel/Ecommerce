import { config } from "dotenv";

config();

export const envConfig = {
  port: process.env.PORT,
  dburl: process.env.DATABASE_URL,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
};
