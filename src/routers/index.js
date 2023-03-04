import Home from'../pages/Home'
import Shirt from'../pages/Shirt'
import Allproduct from '../pages/Allproduct'
import ProductDetail from '../pages/ProductDetail'
import Carts from '../pages/Cart'
import Payment from '../pages/Payment/index,'
const publicRouters = [
  { path: "/", Page: Home },
  { path: "/Shirt", Page: Shirt },
  { path: "/Allproduct", Page: Allproduct },
  { path: "/Product/detail/:id", Page: ProductDetail },
  { path: "/Cart", Page: Carts },
  { path: "/Cart/Payment", Page: Payment },
];

export {publicRouters}