import { Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import Order from "../database/models/orderModel";
import OrderDetail from "../database/models/orderDetail";
import { PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/paymentModel";
import axios from "axios";
import { envConfig } from "../config/config";
import Cart from "../database/models/cartModel";
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
    const {
      phoneNumber,
      addressLine,
      city,
      state,
      zipCode,
      totalAmount,
      paymentMethod,
      firstName,
      lastName,
      email,
    } = req.body;
    const userId = req?.user?.id || "";
    const products: IProduct[] = req.body.products;
    if (
      !phoneNumber ||
      !addressLine ||
      !city ||
      !state ||
      !zipCode ||
      !totalAmount ||
      products.length == 0 ||
      !firstName ||
      !lastName ||
      !email
    ) {
      sendResponse(
        res,
        400,
        "Please Provide Phone Number,ShippingAddress,Total Amount and Product Details"
      );
      return;
    }
    console.log(totalAmount);
    const paymentData = await Payment.create({
      paymentMethod: paymentMethod,
    });
    const orderData = await Order.create({
      phoneNumber,
      addressLine,
      city,
      state,
      zipCode,
      totalAmount,
      userId: userId,
      firstName,
      lastName,
      email,
      paymentId: paymentData.id,
    });
    let data;
    //Order Details
    products.forEach(async (product) => {
      data = await OrderDetail.create({
        quantity: product.productQty,
        productId: product.productId,
        orderId: orderData.id,
      });
      await Cart.destroy({
        where: {
          productId: product.productId,
          userId: userId,
        },
      });
    });
    //for Payment

    if (paymentMethod == PaymentMethod.Khalti) {
      const kdata = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173/",
        amount: totalAmount * 100,
        purchase_order_id: orderData.id,
        purchase_order_name: "order_" + orderData.id,
      };
      const response = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", kdata, {
        headers: {
          Authorization: `Key ${envConfig.khaltikey}`,
        },
      });
      const khaltiresponse = response.data;
      console.log(khaltiresponse);
      paymentData.pidx = khaltiresponse.pidx;
      paymentData.save();
      res.status(200).json({
        message: "Order Created Sucessfully",
        url: khaltiresponse.payment_url,
        pidx: khaltiresponse.pidx,
        data: data,
      });
    } else {
      res.status(200).json({
        message: "Order created Sucessfully",
        data,
      });
    }
  }
  async verifyTrasaction(req: IExtendedRequest, res: Response): Promise<void> {
    const { pidx } = req.body;
    if (!pidx) {
      sendResponse(res, 400, "please provide Pidx");
      return;
    }
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      {
        pidx: pidx,
      },
      {
        headers: {
          Authorization: `Key ${envConfig.khaltikey}`,
        },
      }
    );
    const data = response.data;
    if (data.status === "Completed") {
      await Payment.update(
        { paymentStatus: PaymentStatus.Paid },
        {
          where: {
            pidx: pidx,
          },
        }
      );
      sendResponse(res, 200, "Payment verified Sucessfully");
    } else {
      sendResponse(res, 200, "Payment not verified or cancelled");
    }
  }
  async fetchMyOrders(req: IExtendedRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: {
        userId,
      },

      attributes: ["totalAmount", "id", "orderStatus"],
      include: { model: Payment, attributes: ["id", "paymentMethod", "paymentStatus", "pidx"] },
    });
    if (orders.length > 0) {
      sendResponse(res, 200, "Order Fetched Sucessfully", orders);
    } else {
      sendResponse(res, 404, "No order Found");
    }
  }
  async fetchMyOrderDetail(req: IExtendedRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const userId = req.user?.id;
    const orders = await OrderDetail.findAll({
      where: {
        orderId,
      },
    });
    if (orders.length > 0) {
      sendResponse(res, 200, "Order Fetched Sucessfully", orders);
    } else {
      sendResponse(res, 404, "No order Found");
    }
  }
}

export default new OrderController();
