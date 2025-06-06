import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Register from "./pages/user/Register";
import Home from "./pages/home/Home";
import Product from "./pages/Proudcts/Product";
import Login from "./pages/user/Login";
import SingleProduct from "./pages/single-product/SingleProduct";
import MyCart from "./pages/Cart/MyCart";
import Checkout from "./pages/checkout/Checkout";
import MyOrder from "./pages/my-orders/MyOrder";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />}></Route>
          <Route path="/products" element={<Product />} />
          <Route path="/products/:id" element={<SingleProduct />} />
          <Route path="/my-cart" element={<MyCart />} />
          <Route path="/my-checkout" element={<Checkout />} />
          <Route path="/my-order" element={<MyOrder />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
