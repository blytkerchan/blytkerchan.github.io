import React from "react";

import mainMenu from "../config/mainMenu";
import userMenu from "../config/userMenu";

import { createBrowserRouter, createHashRouter } from "react-router-dom";

import Error from "../pages/Error";
import Posts from "../pages/Posts";

import Layout from "../layout/Layout";
// Pages to lazy-load
const Page = React.lazy(() => import("../pages/Page"));

function router(env) {
  const routingConfig = [
    {
      path: "/",
      element: <Layout mainMenu={mainMenu} userMenu={userMenu} env={env} />,
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
