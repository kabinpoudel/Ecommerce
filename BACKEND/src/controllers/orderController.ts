import { Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import Order from "../database/models/orderModel";
import OrderDetail from "../database/models/orderDetail";
import { PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/paymentModel";
import axios from "axios";
import { envConfig } from "../config/config";
import { promises } from "nodemailer/lib/xoauth2";
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

    const paymentData = await Payment.create({
      orderId: orderData.id,
      paymentMethod: paymentMethod,
    });
    if (paymentMethod == PaymentMethod.Khalti) {
      const data = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173/",
        amount: totalAmount * 100,
        purchase_order_id: orderData.id,
        purchase_order_name: "order_" + orderData.id,
      };
      const response = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", data, {
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
      });
    } else {
      //Esewa Logic
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
}

export default new OrderController();
