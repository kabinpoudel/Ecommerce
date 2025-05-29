import { Response } from "express";
const sendResponse = (
  res: Response,
  statusNumber: number,
  message: String,
  data?: any
) => {
  res.status(statusNumber).json({
    message,
    data: data ? data : null,
  });
};

export default sendResponse;
