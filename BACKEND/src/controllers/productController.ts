import { Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

interface IProductRequest extends Request {
  file?: {
    filename: string;
  };
}
class ProductController {
  async createProduct(req: IProductRequest, res: Response): Promise<void> {
    console.log(req.body);
    const {
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount,
      categoryId,
    } = req.body;
    const fileName = req.file
      ? req.file.filename
      : "https://t4.ftcdn.net/jpg/00/61/42/59/360_F_61425934_wgfz8W7Qey03NhLCjBa7H1HHOY58qlzd.jpg";
    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productTotalStock ||
      !categoryId
    ) {
      sendResponse(
        res,
        400,
        "Please Provide productName,productDescription,productPrice,productTotalStock and discount"
      );
      return;
    }
    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount: discount || 0,
      categoryId,
      productImageUrl: fileName,
    });
    sendResponse(res, 200, "Product Created Sucessfully");
  }
  async getAllProducts(req: Request, res: Response): Promise<void> {
    const datas = await Product.findAll({
      include: {
        model: Category,
      },
    });
    sendResponse(res, 200, "Products Fetched Sucessfully", datas);
  }
  async getProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = await Product.findAll({
      where: {
        id,
      },
      include: {
        model: Category,
      },
    });
    sendResponse(res, 200, "Product Fetched Sucessfully", data);
  }
  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = await Product.findByPk(id);
    if (!data) {
      sendResponse(res, 400, "No Product with that data");
      return;
    }
    await Product.destroy({
      where: {
        id,
      },
    });
    sendResponse(res, 200, "Product Deleted Sucessfully");
  }
  async updateProduct(req: IProductRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const fileName = req.file
      ? req.file.filename
      : "https://t4.ftcdn.net/jpg/00/61/42/59/360_F_61425934_wgfz8W7Qey03NhLCjBa7H1HHOY58qlzd.jpg";
    const {
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount,
      categoryId,
    } = req.body;
    await Product.update(
      {
        productName,
        productDescription,
        productPrice,
        productTotalStock,
        discount,
        categoryId,
      },
      {
        where: { id },
      }
    );
    sendResponse(res, 200, "Product Updated Sucessfully");
  }
}
export default new ProductController();
