import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";

import mainMenu from "./config/mainMenu";
import userMenu from "./config/userMenu";

import environment from "./config/environment";

import Toaster from "./components/Toaster";

import router from "./lib/router";

import usePosts from "./lib/usePosts";
import useCategories from "./lib/useCategories";
import useTitle from "./lib/useTitle";

const App = (props) => {
  const [menu, setMenu] = useState([]);
  const posts = usePosts();
  posts.fetchPosts(environment);
  const categories = useCategories();
  categories.fetchCategories(environment);

  const { t } = useTranslation();
  const { title } = useTitle();

  useEffect(() => {
    document.title = title;
    const cats = categories.listCategories();
    const menu = JSON.parse(JSON.stringify(mainMenu));
    const catMenu = {
      title: t("Categories"),
      icon: "bi-stack",
      path: "/categories",
      children: [],
    };
    cats.forEach((cat) => {
      catMenu.children.push({
        path: `/category/${cat}`,
        title: `${categories.getCategoryName(cat)} (${categories.getCategoryCount(cat)})`,
      });
    });
    menu.push(catMenu);
    setMenu(menu);
    // Pages likely to be used that are lazy-loaded are loaded here so it speeds up UX a bit
    import("./pages/Page");
  }, [title]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router({ mainMenu: menu, userMenu, env: environment })} />
    </>
  );
};

export default App;
