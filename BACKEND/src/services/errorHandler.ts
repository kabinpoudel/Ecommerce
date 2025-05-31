import { Request, Response } from "express";
import sendResponse from "./sendResponse";
const errorHandler = (fn: Function) => {
  return (req: Request, res: Response) => {
    fn(req, res).catch((err: Error) => {
      sendResponse(res, 500, "Internal Error", err);
      return;
    });
  };
};

export default errorHandler;
