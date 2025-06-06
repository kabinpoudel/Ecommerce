import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import dokanlogo from "/nepali dokan.png";
import { fetchCartItems } from "../../store/cartSlice";
import { Menu, X } from "lucide-react"; // For hamburger icon

function Navbar() {
  const reduxToken = useAppSelector((store) => store.auth.user.token);
  const { items } = useAppSelector((store) => store.cart);
  const dispatch = useAppDispatch();
  const isLoggedIn = Boolean(reduxToken || localStorage.getItem("usertoken"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCartItems());
    }
  }, [isLoggedIn]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 bg-white shadow z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center text-2xl">
          <div className="w-10 mr-2">
            <img src={dokanlogo} alt="logo" />
          </div>
          Nepali Dokan
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/products">Products</Link>
          <Link to="#features">Features</Link>
          <Link to="#services">Services</Link>
          <Link to="#stats">Stats</Link>
          <Link to="#testimonials">Testimonials</Link>
        </nav>

        {/* Desktop Auth/Cart */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link to="/my-cart">
                <span>
                  Cart<sup>{items.length > 0 ? items.length : 0}</sup>
                </span>
              </Link>
              <Link to="/logout">
                <button className="py-2 px-5 bg-teal-500 hover:bg-teal-600 text-white rounded">
                  Logout
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="py-2 px-5 bg-teal-500 hover:bg-teal-600 text-white rounded">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="py-2 px-5 bg-teal-500 hover:bg-teal-600 text-white rounded">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            <Link to="/products">Products</Link>
            <Link to="#features">Features</Link>
            <Link to="#services">Services</Link>
            <Link to="#stats">Stats</Link>
            <Link to="#testimonials">Testimonials</Link>
          </nav>
          <div className="mt-4 flex flex-col space-y-3">
            {isLoggedIn ? (
              <>
                <Link to="/my-cart">
                  Cart<sup>{items.length > 0 ? items.length : 0}</sup>
                </Link>
                <Link to="/logout">
                  <button className="w-full py-2 bg-teal-500 text-white rounded">Logout</button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="w-full py-2 bg-teal-500 text-white rounded">Login</button>
                </Link>
                <Link to="/register">
                  <button className="w-full py-2 bg-teal-500 text-white rounded">Register</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
