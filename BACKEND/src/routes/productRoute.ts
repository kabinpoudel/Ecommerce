import express, { Router } from "express";
import ProductController from "../controllers/productController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import { storage, multer } from "../middleware/multerMiddleware";

const upload = multer({ storage: storage });
const router: Router = express.Router();
router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Admin),
    upload.single("productImage"),
    ProductController.createProduct
  )
  .get(ProductController.getAllProducts);
router
  .route("/:id")
  .get(ProductController.getProduct)
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Admin),
    ProductController.deleteProduct
  )
  .patch(
    userMiddleware.isUserLoggedIn,
    userMiddleware.restrictTo(Role.Admin),
    ProductController.updateProduct
  );

export default router;
