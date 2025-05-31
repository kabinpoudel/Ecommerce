import { NextFunction, Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";
import User from "../database/models/UserModel";

export enum Role {
  Admin = "admin",
  Customer = "customer",
}
interface IExtendedRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    password: string;
    id: string;
  };
}

class UserMiddleware {
  async isUserLoggedIn(req: IExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    //Receive Token
    const token = req.headers.authorization;
    if (!token) {
      sendResponse(res, 403, "Token must be Provided");
      return;
    }
    //Validate TOken
    jwt.verify(token, envConfig.jwtSecretKey, async (err, result: any) => {
      if (err) {
        sendResponse(res, 403, "Invalid Token");
        return;
      } else {
        const userData = await User.findByPk(result.userid);
        if (!userData) {
          sendResponse(res, 404, "No user with that userid");
          return;
        }
        req.user = userData;

        next();
      }
    });
  }
  restrictTo(...roles: Role[]) {
    return (req: IExtendedRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as Role;

      if (!roles.includes(userRole)) {
        sendResponse(res, 404, "User Cannot add Category");
        return;
      }
      next();
    };
  }
}

export default new UserMiddleware();
