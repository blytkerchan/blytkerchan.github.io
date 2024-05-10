import React from "react";

import { createBrowserRouter, createHashRouter } from "react-router-dom";

import Error from "../layout/Error";

import Layout from "../layout/Layout";

import Posts from "../layout/Posts";

// Components to lazy-load
const Blog = React.lazy(() => import("../layout/Blog"));
const Categories = React.lazy(() => import("../layout/Categories"));
const Category = React.lazy(() => import("../layout/Category"));
const Page = React.lazy(() => import("../layout/Page"));

function router({ mainMenu, userMenu, env }) {
  const routingConfig = [
    {
      path: "/",
      element: <Layout mainMenu={mainMenu} userMenu={userMenu} env={env} />,
      errorElement: (
        <Layout mainMenu={mainMenu} userMenu={userMenu} env={env}>
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
          path: "blog/*",
          element: <Blog env={env} />,
        },
        {
          path: "categories",
          element: <Categories env={env} />,
        },
        {
          path: "category/*",
          element: <Category env={env} />,
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
