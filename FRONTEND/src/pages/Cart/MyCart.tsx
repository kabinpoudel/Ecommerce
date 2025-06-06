import Navbar from "../../globals/components/Navbar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { handleCartItemUpdate, handleCartItemDelete } from "../../store/cartSlice";
import { Link } from "react-router-dom";

function MyCart() {
  const { items } = useAppSelector((store) => store.cart);
  const dispatch = useAppDispatch();
  const handleUpdate = (productId: string, quantity: number) => {
    dispatch(handleCartItemUpdate(productId, quantity));
  };
  const handleDelete = (productid: string) => {
    dispatch(handleCartItemDelete(productid));
  };
  const subTotal = items.reduce(
    (total, item) => item.Product.productPrice * item.quantity + total,
    0
  );
  const shippingFee = subTotal * 0.01 > 100 ? subTotal * 0.01 : 100;
  return (
    <>
      <Navbar />
      <section className="w-full bg-white dark:bg-[#0A2025] py-9 px-8">
        <h1 className="text-center text-[#191919] dark:text-white text-[32px] font-semibold leading-[38px]">
          My Shopping Cart
        </h1>
        <div className="flex items-start mt-8 gap-6">
          <div className="bg-white p-4 w-[800px] rounded-xl">
            <table className="w-full bg-white rounded-xl">
              <thead>
                <tr className="text-center border-b border-gray-400 w-full text-[#7f7f7f] text-sm font-medium uppercase leading-[14px] tracking-wide">
                  <th className="text-left px-2 py-2">Product</th>
                  <th className="px-2 py-2">price</th>
                  <th className="px-2 py-2">Quantity</th>
                  <th className="px-2 py-2">Subtotal</th>
                  <th className="w-7 px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {items.length > 0 &&
                  items.map((item) => {
                    console.log(item);
                    return (
                      <tr className="text-center">
                        <td className="px-2 py-2 text-left align-top">
                          <img
                            src={"http://localhost:3001/" + item.Product.productImageUrl}
                            alt="test"
                            className="w-[100px] mr-2 inline-block h-[100px]"
                          />
                          <span>{item.Product.productName}</span>
                        </td>
                        <td className="px-2 py-2">${item.Product.productPrice}</td>
                        <td className="p-2 mt-9 bg-white rounded-[170px] border border-[#a0a0a0] justify-around items-center flex">
                          <svg
                            onClick={() => handleUpdate(item.productId, item.quantity - 1)}
                            width={14}
                            height={15}
                            className="cursor-pointer"
                            viewBox="0 0 14 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.33398 7.5H11.6673"
                              stroke="#666666"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="w-10 text-center text-[#191919] text-base font-normal leading-normal">
                            {item.quantity}
                          </span>
                          <svg
                            onClick={() => handleUpdate(item.productId, item.quantity + 1)}
                            className="cursor-pointer relative"
                            width={14}
                            height={15}
                            viewBox="0 0 14 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.33398 7.49998H11.6673M7.00065 2.83331V12.1666V2.83331Z"
                              stroke="#1A1A1A"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </td>
                        <td className="px-2 py-2">${item.quantity * item.Product.productPrice}</td>
                        <td className="px-2 py-2">
                          <svg
                            onClick={() => handleDelete(item.productId)}
                            width={24}
                            className="cursor-pointer"
                            height={25}
                            viewBox="0 0 24 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 23.5C18.0748 23.5 23 18.5748 23 12.5C23 6.42525 18.0748 1.5 12 1.5C5.92525 1.5 1 6.42525 1 12.5C1 18.5748 5.92525 23.5 12 23.5Z"
                              stroke="#CCCCCC"
                              strokeMiterlimit={10}
                            />
                            <path
                              d="M16 8.5L8 16.5"
                              stroke="#666666"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16 16.5L8 8.5"
                              stroke="#666666"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="w-[424px] bg-white rounded-lg p-6">
            <h2 className="text-[#191919] mb-2 text-xl font-medium leading-[30px]">Cart Total</h2>
            <div className="w-[376px] py-3 shadow-[0px_1px_0px_0px_rgba(229,229,229,1.00)] justify-between items-center flex">
              <span className="text-[#4c4c4c] text-sm font-normal leading-[21px]">Subtotal:</span>
              <span className="text-[#191919] text-sm font-medium leading-[21px]">${subTotal}</span>
            </div>
            <div className="w-[376px] py-3 shadow-[0px_1px_0px_0px_rgba(229,229,229,1.00)] justify-between items-center flex">
              <span className="text-[#4c4c4c] text-sm font-normal leading-[21px]">Shipping:</span>
              <span className="text-[#191919] text-sm font-medium leading-[21px]">
                ${shippingFee}
              </span>
            </div>

            <div className="w-[376px] py-3 justify-between items-center flex">
              <span className="text-[#4c4c4c] text-base font-normal leading-normal">Total:</span>
              <span className="text-[#191919] text-base font-semibold leading-tight">
                $ {shippingFee + subTotal}
              </span>
            </div>
            <Link to="/my-checkout">
              <button className="w-[376px] text-white mt-5 px-10 py-4 bg-[#00b206] rounded-[44px] gap-4 text-base font-semibold leading-tight">
                Proceed to checkout
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
export default MyCart;
