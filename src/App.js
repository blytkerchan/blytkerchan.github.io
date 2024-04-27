import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";

import environment from "./config/environment";

import Toaster from "./components/Toaster";

import router from "./lib/router";

const App = (props) => {
  useEffect(() => {
    // Pages likely to be used that are lazy-loaded are loaded here so it speeds up UX a bit
    import("./pages/Customers");
    import("./pages/Dashboard");
    import("./pages/Orders");
    import("./pages/Page");
    import("./pages/Products");
  }, []);

  return (
    <>
      <Toaster />
      <RouterProvider router={router(environment)} />
    </>
  );
};

export default App;
