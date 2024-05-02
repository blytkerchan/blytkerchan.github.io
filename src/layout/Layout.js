import React from "react";
import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";

const Layout = ({ mainMenu, userMenu, env, children }) => {
  return (
    <>
      <Header name={env.title} logoLocation="/logo.svg" mainMenu={mainMenu} userMenu={userMenu} />
      <div className="d-flex">
        <div className="vln-fullscreen-block">
          <div className="p-2 flex-shrink-1">
            <Sidebar menu={mainMenu} />
          </div>
        </div>
        <div className="p-2 w-100 vln-scroll-box" id="scrollBox">
          <div className="container-fluid pb-3">
            <div className="bg-light border rounded-3">
              <div className="p-2" style={{ minHeight: "80vh" }}>
                <React.Suspense fallback=<Spinner />>
                  <Outlet />
                </React.Suspense>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer>Place sticky footer content here.</Footer>
    </>
  );
};

export default Layout;
