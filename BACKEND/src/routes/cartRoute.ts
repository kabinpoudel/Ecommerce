import express, { Router } from "express";
import cartController from "../controllers/cartController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errorHandler";

const router: Router = express.Router();

router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Customer),
    errorHandler(cartController.addToCart)
  )
  .get(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Customer),
    errorHandler(cartController.getMyCartItem)
  );
router
  .route("/:productId")
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Customer),
    errorHandler(cartController.deleteMyCartItems)
  )
  .patch(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Customer),
    errorHandler(cartController.updateCartItemQuantity)
  );

export default router;
