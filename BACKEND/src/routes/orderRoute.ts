import express, { Router } from "express";
import orderController from "../controllers/orderController";
import userMiddleware from "../middleware/userMiddleware";

const router: Router = express.Router();

router.route("/").post(userMiddleware.isUserLoggedIn, orderController.createOrder);

export default router;
