import type { Status } from "../globals/types/type";

export interface User {
  name: string;
  age: number;
}

interface ProductInfo {
  productName: string;
  qty: number;
}

export interface Product {
  products: [] | ProductInfo[];
}

interface ICartProduct {
  id: string;
  productName: string;
  productPrice: number;
  productImageUrl: string;
}

export interface ICartItem {
  quantity: string;
  id: string;
  productId: string;
  Product: ICartProduct;
}
export interface ICartInitialState {
  items: ICartItem[];
  status: Status;
}

export interface ICartUpdateItem {
  productId: string;
  quantity: number;
}
interface IPayment {
  id: string;
  paymentMethod: string;
  paymentStatus: string;
  pidx: string | null;
}

export interface IOrderItems {
  id: string;
  orderStatus: string;
  totalAmount: number;
  Payment: IPayment;
}
export interface IOrder {
  status: Status;
  items: IOrderItems[];
  khaltiUrl: string | null;
}
export const PaymentMethod = {
  Esewa: "esewa",
  Khalti: "khalti",
  Cod: "cod",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface IProductCheckout {
  productId: string;
  productQty: string;
}
export interface IData {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  addressLine: string;
  city: string;
  state: string;
  zipCode: number;
  totalAmount: number;
  email: string;
  paymentMethod: PaymentMethod;
  products: IProductCheckout[];
}
