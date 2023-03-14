import Home from "../pages/Home";
import Shirt from "../pages/Shirt";
import Allproduct from "../pages/Allproduct";
import ProductDetail from "../pages/ProductDetail";
import Carts from "../pages/Cart";
import Payment from "../pages/Payment/index,";
import InfoUser from "../pages/InfoUser";
import InfoOder from "../pages/InfoOder";
const publicRouters = [
  { path: "/", Page: Home },
  { path: "/Shirt", Page: Shirt },
  { path: "/Allproduct", Page: Allproduct },
  { path: "/Product/detail/:id", Page: ProductDetail },
  { path: "/Cart", Page: Carts },
  { path: "/Cart/Payment", Page: Payment },
  { path: "/User/:id", Page: InfoUser },
  { path: "/User/Oder", Page: InfoOder },
];

export { publicRouters };
