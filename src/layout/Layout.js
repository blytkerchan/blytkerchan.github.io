import React from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import Spinner from './Spinner';

const Layout = (props) => {
  return (
    <div>
      <Header name="Vlinder Software" logoLocation="/logo.svg" />
      <div className="d-flex" style={{ marginBottom: 55 }}>
        <div className="vln-fullscreen-block">
          <div className="p-2 flex-shrink-1">
            <Sidebar />
          </div>
        </div>
        <div className="p-2 w-100 vln-scroll-box">
          <div className="container-fluid">
            <div className="container-fluid pb-3">
              <div className="bg-light border rounded-3">
                <div className="p-2" style={{ minHeight: "80vh" }}>
                  <React.Suspense fallback=<Spinner />>
                    <Outlet />
                  </React.Suspense>
                  {props.children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer>Place sticky footer content here.</Footer>
    </div>
  );
};

export default Layout;
