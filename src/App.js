import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import mainMenu from './config/mainMenu';
import userMenu from './config/userMenu';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Error from "./pages/Error";
import Home from "./pages/Home";

import Layout from "./layout/Layout";

// Pages to lazy-load
const Customers = React.lazy(() => import("./pages/Customers"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Page = React.lazy(() => import("./pages/Page"));
const Products = React.lazy(() => import("./pages/Products"));

const router = createBrowserRouter([
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
        element: <Home />,
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
]);

class App extends React.Component {
  componentDidMount() {
    // Pages likely to be used that are lazy-loaded are loaded here so it speeds up UX a bit
    import("./pages/Customers");
    import("./pages/Dashboard");
    import("./pages/Orders");
    import("./pages/Page");
    import("./pages/Products");
  }

  render(props) {
    return <RouterProvider router={router} />;
  }
}

export default App;
