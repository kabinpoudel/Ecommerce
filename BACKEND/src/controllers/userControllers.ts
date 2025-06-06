import { Request, Response } from "express";
import User from "../database/models/UserModel";
import bcrypt from "bcrypt";
import generateToken from "../services/generateToken";
import generateOtp from "../services/generateOtp";
import sendMail from "../services/sendMail";
import findData from "../services/findData";
import sendResponse from "../services/sendResponse";
import checkOtpExpiration from "../services/checkOtpExpiration";
import { envConfig } from "../config/config";

class UserController {
  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      sendResponse(res, 400, "Please Provide username, email and Password");
      return;
    }
    const [data] = await User.findAll({
      where: {
        email: email,
      },
    });
    if (data) {
      sendResponse(res, 400, "Please try again Later");
    }
    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 14),
    });
    await sendMail({
      to: email,
      subject: "Registration Sucessful on Nepali Dokan",
      text: "Welcome to Digital Dokan, Thank you for registering",
    });
    sendResponse(res, 201, "User Registered Sucessfully");
  }
  static async login(req: Request, res: Response) {
    //accept incomming Data --->Email, password
    const { email, password } = req.body;
    if (!email || !password) {
      sendResponse(res, 400, "Please Provide Email and Password");
      return;
    }
    // Check email exists or not at first
    const user = await User.findAll({
      where: {
        email: email,
      },
    });

    //if yes --> email exist ==> check password too
    if (user.length == 0) {
      sendResponse(res, 404, "No User with that Email 😟😟😟");
    } else {
      //if password is correct --> token generate(jwt)
      const isEqual = bcrypt.compareSync(password, user[0].password);
      if (!isEqual) {
        sendResponse(res, 200, "Invalid Password");
      } else {
        const token = generateToken(user[0].id);
        sendResponse(res, 200, "Logged In sucessfully", token);
      }
    }
  }
  static async handleForgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      sendResponse(res, 200, "Please Provide Email");
      return;
    }

    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!user) {
      sendResponse(res, 404, "E-mail not registered");
      return;
    }
    // Send OTP  ->generate OTP and send Mail
    const otp = generateOtp();
    await sendMail({
      to: email,
      subject: "Nepali Dokan Password Change Request",
      text: `You requested for OTP. Here is your OTP = ${otp}`,
    });
    user.otp = otp.toString();
    user.otpGenerateTime = Date.now().toString();
    await user.save();
    sendResponse(res, 200, "OTP sent Sucessfully");
  }
  static async verifyOtp(req: Request, res: Response) {
    const { otp, email } = req.body;
    if (!otp || !email) {
      res.status(400).json({
        message: "Please provide OTP and Email",
      });
      return;
    }
    const [user] = await findData(User, "email", email);
    if (!user) {
      sendResponse(res, 404, "No user with that Email");
    }
    //OTP Verification
    const data = await User.findOne({
      where: {
        otp,
        email,
      },
    });

    if (!data) {
      sendResponse(res, 404, "Invalid OTP");
      return;
    }
    const otpGenerateTime = data.otpGenerateTime;
    checkOtpExpiration(res, otpGenerateTime, envConfig.otpThreshold);
  }
  static async resetPassword(req: Request, res: Response) {
    const { newPassword, confirmPassword, email, otp } = req.body;
    if (!newPassword || !confirmPassword || !otp || !email) {
      sendResponse(res, 400, "Please provide Email, OTP, New Password, Confirm Password");
      return;
    }
    if (newPassword !== confirmPassword) {
      sendResponse(res, 400, "New Password and Confirm Password must be Same");
      return;
    }
    const [user] = await findData(User, "email", email);
    if (!user) {
      sendResponse(res, 404, "No Email with that User");
      return;
    }
    if (!user.otp) {
      sendResponse(res, 400, "You have already Changed your Password");
      return;
    }
    const otpGenerateTime = user.otpGenerateTime;
    checkOtpExpiration(res, otpGenerateTime, envConfig.otpThreshold);
    if (otp != user.otp) {
      sendResponse(res, 400, "OTP doesn't Match");
      return;
    }

    user.password = bcrypt.hashSync(newPassword, 12);
    user.otp = null;
    user.otpGenerateTime = null;
    await user.save();
    sendResponse(res, 200, "Password Reset Sucessfully");
  }
}

export default UserController;
