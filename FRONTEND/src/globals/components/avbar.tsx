import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import dokanlogo from "/nepali dokan.png";
import { fetchCartItems } from "../../store/cartSlice";

function Navbar() {
  const reduxToken = useAppSelector((store) => store.auth.user.token);
  const { items } = useAppSelector((store) => store.cart);
  const localStorageToken = localStorage.getItem("usertoken");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (reduxToken || localStorageToken) {
      setIsLoggedIn(true);
      dispatch(fetchCartItems());
    }
  }, []);
  console.log(isLoggedIn);

  return (
    <>
      <header className="sticky top-0 bg-white shadow">
        <div className="container flex flex-col sm:flex-row justify-between items-center mx-auto py-4 px-8">
          <div className="flex items-center text-2xl">
            <div className="w-12 mr-3">
              <img src={dokanlogo} alt="logo" />
            </div>
            Nepali Dokan
          </div>
          <div className="flex mt-4 sm:mt-0">
            <Link className="px-4" to="/products">
              Products
            </Link>
            <Link className="px-4" to="#features">
              Features
            </Link>
            <Link className="px-4" to="#services">
              Services
            </Link>
            <Link className="px-4" to="#stats">
              Stats
            </Link>
            <Link className="px-4" to="#testimonials">
              Testimonials
            </Link>
          </div>
          <div className="hidden md:block">
            {isLoggedIn ? (
              <>
                <Link className="mr-[20px] " to="/my-cart">
                  <span>
                    Cart<sup>{items.length > 0 ? items.length : 0}</sup>
                  </span>
                </Link>
                <Link to="/logout">
                  <button
                    type="button"
                    className=" py-3 px-8 text-sm bg-teal-500 hover:bg-teal-600 rounded text-white "
                  >
                    Logout
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button
                    type="button"
                    className="mr-3 py-3 px-8 text-sm bg-teal-500 hover:bg-teal-600 rounded text-white "
                  >
                    Login
                  </button>
                </Link>

                <Link to="/register" className="mr-3">
                  <button
                    type="button"
                    className=" py-3 px-8 text-sm bg-teal-500 hover:bg-teal-600 rounded text-white "
                  >
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
export default Navbar;
