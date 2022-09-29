/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
// import Notifications from "views/Notifications.js";
import Products from "views/Products.js";
import Orders from "views/Orders.js";
// import UserPage from "views/User.js";
import CreateOrder from "views/CreateOrder";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/products",
    name: "List Sản Phẩm",
    icon: "nc-icon nc-ambulance",
    component: Products,
    layout: "/admin",
  },

  {
    path: "/orders",
    name: "List Hóa Đơn",
    icon: "nc-icon nc-delivery-fast",
    component: Orders,
    layout: "/admin",
  },
  {
    path: "/create-order",
    name: "Tạo Hóa Đơn",
    icon: "nc-icon nc-ruler-pencil",
    component: CreateOrder,
    layout: "/admin",
  },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "nc-icon nc-bell-55",
  //   component: Notifications,
  //   layout: "/admin"
  // },
  // {
  //   path: "/user-page",
  //   name: "User Profile",
  //   icon: "nc-icon nc-single-02",
  //   component: UserPage,
  //   layout: "/admin",
  // },
];
export default routes;
