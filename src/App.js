import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

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

const App = (props) => {
  const posts = usePosts();
  posts.fetchPosts(environment);
  const categories = useCategories();
  categories.fetchCategories(environment);

  useEffect(() => {
    document.title = environment.title;

    // Pages likely to be used that are lazy-loaded are loaded here so it speeds up UX a bit
    import("./pages/Page");
  }, []);

  return (
    <>
      <Toaster />
      <RouterProvider router={router({ mainMenu, userMenu, env: environment })} />
    </>
  );
};

export default App;
