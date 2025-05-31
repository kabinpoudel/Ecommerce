import express, { Router } from "express";
import ProductController from "../controllers/productController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import { storage, multer } from "../middleware/multerMiddleware";
import errorHandler from "../services/errorHandler";
const upload = multer({ storage: storage });
const router: Router = express.Router();
router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Admin),
    upload.single("productImage"),
    errorHandler(ProductController.createProduct)
  )
  .get(ProductController.getAllProducts);
router
  .route("/:id")
  .get(ProductController.getProduct)
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Admin),
    errorHandler(ProductController.deleteProduct)
  )
  .patch(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Admin),
    errorHandler(ProductController.updateProduct)
  );

export default router;
