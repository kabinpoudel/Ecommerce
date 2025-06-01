import { Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}
class CartController {
  async addToCart(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      sendResponse(res, 400, "Please Provide quantity , ProudctId");
      return;
    }
    //check if that item already exists on the user cart increse quantity else insert
    const cartOfUser = await Cart.findOne({
      where: {
        productId,
        userId,
      },
    });
    if (cartOfUser) {
      cartOfUser.quantity += quantity;
      await cartOfUser.save();
    } else {
      await Cart.create({
        userId,
        productId,
        quantity,
      });
    }
    sendResponse(res, 200, "Product Added to Cart");
  }

  async getMyCartItem(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
          attributes: ["id", "productName", "productPrice", "productImageUrl"],
        },
      ],
    });
    if (cartItems.length === 0) {
      sendResponse(res, 404, "No items in the cart");
    } else {
      sendResponse(res, 200, "Cart Items Fetched Sucessfully");
    }
  }
  async deleteMyCartItems(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) {
      sendResponse(res, 404, "No Product with that Id");
      return;
    }
    await Cart.destroy({
      where: {
        productId,
        userId,
      },
    });
    sendResponse(res, 200, "Product from cart deleted sucessfully");
  }

  async updateCartItemQuantity(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!quantity) {
      sendResponse(res, 400, "Please Provide quantity");
    }
    const cartItem = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (!cartItem) {
      sendResponse(res, 404, "No Product with that productid present in cart");
    } else {
      cartItem.quantity = quantity;
      await cartItem.save();
      sendResponse(res, 200, "Cart Updated");
    }
  }
}

export default new CartController();
