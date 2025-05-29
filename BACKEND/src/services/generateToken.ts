import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";
const generateToken = (userid: string) => {
  const token = jwt.sign(
    { userid: userid },
    envConfig.jwtSecretKey as string,
    {
      expiresIn: envConfig.jwtExpiresIn,
    } as jwt.SignOptions
  );
  return token;
};
export default generateToken;
