import sendResponse from "./sendResponse";
import { Response } from "express";

const checkOtpExpiration = (
  res: Response,
  otpGenerateTime: string,
  thresholdTime: number
) => {
  const currentTime = Date.now();
  if (currentTime - +otpGenerateTime <= thresholdTime) {
    //OTP Valid
    sendResponse(res, 200, "Valid OTP, now you can proceed to reset Password");
  } else {
    //OTP Expired
    sendResponse(res, 403, "OTP expired, Sorry try again Later 😟😟");
  }
};
export default checkOtpExpiration;
