import express, { Router } from "express";
import categoryController from "../controllers/categoryController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errorHandler";
const router: Router = express.Router();

router
  .route("/")
  .get(categoryController.getCategories)
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Admin),
    errorHandler(categoryController.addCategory)
  );
router
  .route("/:id")
  .patch(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Admin),
    errorHandler(categoryController.updateCategory)
  )
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Admin),
    errorHandler(categoryController.deleteCategory)
  );

export default router;
