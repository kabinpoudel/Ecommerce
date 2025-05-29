import express from "express";
import UserController from "../controllers/userControllers";

const router = express.Router();
router.route("/register").post(UserController.register);
router.route("/login").post(UserController.login);
router.route("/forgot-password").post(UserController.handleForgotPassword);
router.route("/verify-otp").post(UserController.verifyOtp);
router.route("/reset-password").post(UserController.resetPassword);

export default router;
