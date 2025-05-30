import Category from "../database/models/categoryModel";
import { Request, Response } from "express";
import sendResponse from "../services/sendResponse";

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
    },
    {
      categoryName: "Groceries",
    },
    {
      categoryName: "Foods",
    },
  ];
  async seedCategory(): Promise<void> {
    const datas = await Category.findAll();
    if (datas.length === 0) {
      await Category.bulkCreate(this.categoryData);
      console.log("Category Seeded Sucessfully");
    } else {
      console.log("Category already seeded");
    }
  }
  async addCategory(req: Request, res: Response): Promise<void> {
    const { categoryName } = req.body;
    if (!categoryName) {
      sendResponse(res, 400, "Please Provide category Name");
      return;
    }
    await Category.create({
      categoryName,
    });
    sendResponse(res, 200, "Category created Sucessfully");
  }
  async getCategories(req: Request, res: Response): Promise<void> {
    const data = await Category.findAll();
    sendResponse(res, 200, "fetched Categories", data);
  }
  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      sendResponse(res, 400, "Please Provide ID");
      return;
    }
    const data = await Category.findByPk(id);
    if (!data) {
      sendResponse(res, 404, "No Category With that ID");
    } else {
      await Category.destroy({
        where: {
          id,
        },
      });
      sendResponse(res, 200, "Category deleted Sucessfully");
    }
  }
  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { categoryName } = req.body;
    if (!id || !categoryName) {
      sendResponse(res, 400, "Please Provide ID and Category name to Update");
    }
    const data = await Category.findByPk(id);
    if (!data) {
      sendResponse(res, 404, "No Category with that id");
    } else {
      await Category.update(
        {
          categoryName: categoryName,
        },
        {
          where: {
            id,
          },
        }
      );
      sendResponse(res, 200, "Category Updated Sucessfully");
    }
  }
}

export default new CategoryController();
