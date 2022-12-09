import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import mainMenu from './mainMenu';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Error from "./pages/Error";
import Home from "./pages/Home";

import Layout from "./layout/Layout";

const About = React.lazy(() => import("./pages/About"));
const Customers = React.lazy(() => import("./pages/Customers"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Products = React.lazy(() => import("./pages/Products"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout mainMenu={mainMenu} />,
    errorElement: (
      <Layout mainMenu={mainMenu}>
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
        element: <About />,
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
    import("./pages/About");
    import("./pages/Customers");
    import("./pages/Dashboard");
    import("./pages/Orders");
    import("./pages/Products");
  }

  render(props) {
    return <RouterProvider router={router} />;
  }
}

export default App;
