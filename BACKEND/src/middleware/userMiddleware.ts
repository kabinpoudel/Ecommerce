import { NextFunction, Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";

class UserMiddleware {
  async isUserLoggedIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    //Receive Token
    const token = req.headers.authorization;
    if (!token) {
      sendResponse(res, 403, "Token must be Provided");
      return;
    }
    //Validate TOken
    jwt.verify(token, envConfig.jwtSecretKey, async (err, result) => {
      if (err) {
        sendResponse(res, 403, "Invalid Token");
        return;
      } else {
        next();
      }
    });
    //Next
  }
}

export default new UserMiddleware();
