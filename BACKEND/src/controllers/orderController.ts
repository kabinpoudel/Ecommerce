import { Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import Order from "../database/models/orderModel";
import OrderDetail from "../database/models/orderDetail";
import { PaymentMethod } from "../globals/types";
import Payment from "../database/models/paymentModel";
interface IProduct {
  productId: string;
  productQty: string;
}
export interface IExtendedRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    password: string;
    id: string;
  };
}
class OrderController {
  async createOrder(req: IExtendedRequest, res: Response) {
    const { phoneNumber, shippingAddress, totalAmount, paymentMethod } = req.body;
    const userId = req?.user?.id || "";
    const products: IProduct[] = req.body.products;
    if (!phoneNumber || !shippingAddress || !totalAmount || products.length == 0) {
      sendResponse(
        res,
        400,
        "Please Provide Phone Number,ShippingAddress,Total Amount and Product Details"
      );
      return;
    }
    console.log(totalAmount);
    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId: userId,
    });
    //Order Details
    products.forEach(async (product) => {
      await OrderDetail.create({
        quantity: product.productQty,
        productId: product.productId,
        orderId: orderData.id,
      });
    });
    //for Payment
    if (paymentMethod == PaymentMethod.COD) {
      Payment.create({
        orderId: orderData.id,
        paymentMethod: paymentMethod,
      });
      sendResponse(res, 200, "order created sucessfully");
    } else if (paymentMethod == PaymentMethod.Khalti) {
      //Khalti Logic
    } else {
      //Esewa Logic
    }
  }
}

export default new OrderController();
