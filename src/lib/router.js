import React from "react";

import mainMenu from "../config/mainMenu";
import userMenu from "../config/userMenu";

import { createBrowserRouter, createHashRouter } from "react-router-dom";

import Error from "../pages/Error";
import Posts from "../components/Posts";

import Layout from "../layout/Layout";
// Pages to lazy-load
const Customers = React.lazy(() => import("../pages/Customers"));
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Orders = React.lazy(() => import("../pages/Orders"));
const Page = React.lazy(() => import("../pages/Page"));
const Products = React.lazy(() => import("../pages/Products"));

function router(env) {
  const routingConfig = [
    {
      path: "/",
      element: <Layout mainMenu={mainMenu} userMenu={userMenu} />,
      errorElement: (
        <Layout mainMenu={mainMenu} userMenu={userMenu}>
          <Error />
        </Layout>
      ),
      children: [
        {
          path: "",
          element: <Posts env={env} />,
        },
        {
          path: "about",
          element: <Page name="about" />,
        },
        {
          path: "customers",
          element: <Customers />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "orders",
          element: <Orders />,
        },
        {
          path: "products",
          element: <Products />,
        },
      ],
    },
  ];

  if (env["useHashRouting"]) {
    return createHashRouter(routingConfig);
  } else {
    return createBrowserRouter(routingConfig);
  }
}

export default router;
