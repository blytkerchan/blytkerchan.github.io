import React from "react";

import { render, queryByAttribute } from "@testing-library/react";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./Header";

const getById = queryByAttribute.bind(null, "id");

const Layout = (props) => {
  return (
    <>
      <Header mainMenu={props.mainMenu} userMenu={props.userMenu} />
      <Outlet />
    </>
  );
};
const Error = (props) => {
  return <></>;
};
const router = (mainMenu, userMenu) =>
  createBrowserRouter([
    {
      path: "/",
      element: <Layout mainMenu={mainMenu} userMenu={userMenu} />,
      errorElement: <Error />,
    },
  ]);

const checkMenuItem = (li, index, menu) => {
  expect(li.nodeName).toEqual("LI");
  // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
  const a = li.querySelector("a");
  const href = a.getAttributeNode("href");
  expect(href.value).toEqual(menu[index].path);
  const re = new RegExp(`^${menu[index].title}$`);
  expect(li.textContent).toMatch(re);
};

describe("Header renders the menu passed to it, excluding icons", () => {
  test("empty menu == empty menu", () => {
    const menu = [];

    const view = render(<RouterProvider router={router(menu, [])} />);

    const ul = getById(view.container, "mainMenuItems");
    // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
    expect(ul.childElementCount).toEqual(menu.length);
    ul.childNodes.forEach((li, index) => {
      checkMenuItem(li, index, menu);
    });
  });

  test("1 menu item", () => {
    const menu = [
      {
        path: "/",
        title: "Home",
        icon: "bi-home",
      },
    ];

    const view = render(<RouterProvider router={router(menu, [])} />);

    const ul = getById(view.container, "mainMenuItems");
    // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
    expect(ul.childElementCount).toEqual(menu.length);
    ul.childNodes.forEach((li, index) => {
      checkMenuItem(li, index, menu);
    });
  });

  test("5 menu items", () => {
    const menu = [
      {
        path: "/",
        title: "Home",
        icon: "bi-house",
      },
      {
        path: "/dashboard",
        title: "Dashboard",
        icon: "bi-speedometer",
      },
      {
        path: "/orders",
        title: "Orders",
        icon: "bi-table",
      },
      {
        path: "/products",
        title: "Products",
        icon: "bi-grid",
      },
      {
        path: "/customers",
        title: "Customers",
        icon: "bi-people",
      },
    ];

    const view = render(<RouterProvider router={router(menu, [])} />);

    const ul = getById(view.container, "mainMenuItems");
    // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
    expect(ul.childElementCount).toEqual(menu.length);
    ul.childNodes.forEach((li, index) => {
      checkMenuItem(li, index, menu);
    });
  });
});

describe("Header renders the user menu passed to it, excluding icons", () => {
  test("empty menu == empty menu", () => {
    const menu = [];

    const view = render(<RouterProvider router={router([], menu)} />);

    const ul = getById(view.container, "userMenuItems");
    // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
    expect(ul.childElementCount).toEqual(menu.length);
    ul.childNodes.forEach((li, index) => {
      checkMenuItem(li, index, menu);
    });
  });

  test("1 menu item", () => {
    const menu = [
      {
        path: "/",
        title: "Home",
        icon: "bi-home",
      },
    ];

    const view = render(<RouterProvider router={router([], menu)} />);

    const ul = getById(view.container, "userMenuItems");
    // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
    expect(ul.childElementCount).toEqual(menu.length);
    ul.childNodes.forEach((li, index) => {
      checkMenuItem(li, index, menu);
    });
  });

  test("5 menu items", () => {
    const menu = [
      {
        path: "/",
        title: "Home",
        icon: "bi-house",
      },
      {
        path: "/dashboard",
        title: "Dashboard",
        icon: "bi-speedometer",
      },
      {
        path: "/orders",
        title: "Orders",
        icon: "bi-table",
      },
      {
        path: "/products",
        title: "Products",
        icon: "bi-grid",
      },
      {
        path: "/customers",
        title: "Customers",
        icon: "bi-people",
      },
    ];

    const view = render(<RouterProvider router={router([], menu)} />);

    const ul = getById(view.container, "userMenuItems");
    // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
    expect(ul.childElementCount).toEqual(menu.length);
    ul.childNodes.forEach((li, index) => {
      checkMenuItem(li, index, menu);
    });
  });
});
