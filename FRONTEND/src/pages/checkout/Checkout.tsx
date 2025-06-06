import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Navbar from "../../globals/components/Navbar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { PaymentMethod, type IData } from "../../store/types";
import { orderItem } from "../../store/checkoutSlice";

function Checkout() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((store) => store.cart);
  const { khaltiUrl } = useAppSelector((store) => store.orders);
  const subTotal = items.reduce(
    (total, item) => item.Product.productPrice * +item.quantity + total,
    0
  );
  const shippingFee = subTotal * 0.01 > 100 ? subTotal * 0.01 : 100;
  const productData =
    items.length > 0
      ? items.map((item) => {
          return {
            productId: item.Product.id,
            productQty: item.quantity,
          };
        })
      : [];

  const [data, setData] = useState<IData>({
    firstName: "",
    lastName: "",
    addressLine: "",
    city: "",
    totalAmount: subTotal + shippingFee,
    zipCode: 0,
    email: "",
    phoneNumber: 0,
    state: "",
    paymentMethod: PaymentMethod.Cod,
    products: productData,
  });
  console.log(data);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await dispatch(orderItem(data));
  };
  let btnText = "Complete Purchase";
  if (data.paymentMethod === "khalti") {
    btnText = "Pay with Khalti";
  }
  useEffect(() => {
    if (khaltiUrl) {
      window.location.href = khaltiUrl;
      return;
    }
  }, [khaltiUrl]);
  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Left Column - Order Summary */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Block Sweater</h1>
          {/* Items List */}
          <div className="space-y-6">
            {/* Item 1 */}
            {items.length > 0 ? (
              items.map((item) => {
                return (
                  <div className="border-b pb-4 flex gap-4" key={item.id}>
                    <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={"http://localhost:3001/" + item.Product.productImageUrl}
                        alt="Dark Green T-shirt"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-medium text-gray-700">
                        {item.Product.productName}
                      </h2>
                      <div className="flex justify-between mt-2 text-gray-600">
                        <span>
                          {item.quantity} × ${item.Product.productPrice}
                        </span>
                        <span className="font-medium">
                          ${item.Product.productPrice * +item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>NO items</p>
            )}
          </div>
          {/* Price Summary */}
          <div className="mt-8 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">$ {subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">$ {shippingFee}</span>
            </div>

            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-gray-800 font-bold">Total</span>
              <span className="text-lg font-bold">$ {subTotal + shippingFee}</span>
            </div>
          </div>
          {/* Complete Purchase Button */}
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded mt-6 transition duration-200"
            >
              {btnText}
            </button>
          </form>
        </div>
        {/* Right Column - Delivery and Payment */}
        <div className="w-full md:w-1/2 space-y-8">
          {/* Delivery Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">First Name</label>
                <input
                  onChange={handleChange}
                  name="firstName"
                  type="text"
                  placeholder="Enter First Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Last Name */}
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">Last Name</label>
                <input
                  onChange={handleChange}
                  name="lastName"
                  type="text"
                  placeholder="Enter Last Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Email */}
              <div className="form-group md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Phone */}
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">Phone No.</label>
                <input
                  onChange={handleChange}
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter Phone No."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Address */}
              <div className="form-group md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">Address Line</label>
                <input
                  onChange={handleChange}
                  name="addressLine"
                  type="text"
                  placeholder="Enter Address Line"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* City */}
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">City</label>
                <input
                  onChange={handleChange}
                  name="city"
                  type="text"
                  placeholder="Enter City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* State */}
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">State</label>
                <input
                  onChange={handleChange}
                  name="state"
                  type="text"
                  placeholder="Enter State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Zip Code */}
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">Zip Code</label>
                <input
                  onChange={handleChange}
                  name="zipCode"
                  type="text"
                  placeholder="Enter Zip Code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment</h2>
            <div className="space-y-4">
              {/* KHALTI */}
              <label
                htmlFor="payment_khalti"
                className="flex items-center gap-3 border border-gray-200 rounded-md hover:border-blue-400 cursor-pointer p-3"
              >
                <input
                  type="radio"
                  id="payment_khalti"
                  name="paymentMethod"
                  onChange={handleChange}
                  value="khalti"
                />
                <div>
                  <p className="font-medium">Khalti</p>
                  <p className="text-sm text-gray-500">Pay with Khalti Wallet</p>
                </div>
              </label>

              {/* COD */}
              <label
                htmlFor="payment_cod"
                className="flex items-center gap-3 border border-gray-200 rounded-md hover:border-blue-400 cursor-pointer p-3"
              >
                <input
                  type="radio"
                  id="payment_cod"
                  name="paymentMethod"
                  onChange={handleChange}
                  value="cod"
                />
                <div>
                  <p className="font-medium">COD</p>
                  <p className="text-sm text-gray-500">Pay later (COD)</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
