import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import About from './pages/About';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error';
import Home from './pages/Home';
import Orders from './pages/Orders';
import Products from './pages/Products';

import Layout from './layout/Layout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Layout><Error /></Layout>,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "customers",
        element: <Customers />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "orders",
        element: <Orders />
      },
      {
        path: "products",
        element: <Products />
      },
    ],
  },
]);

const App = (props) => {
  return(
    <RouterProvider router={router} />
  );
}

export default App;
