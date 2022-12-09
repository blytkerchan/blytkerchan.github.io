import React from "react";

import {
  render,
  queryByAttribute,
} from "@testing-library/react";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const getById = queryByAttribute.bind(null, "id");

const Layout = (props) => {
  return (
    <>
      <Sidebar menu={props.menu} />
      <Outlet />
    </>
  );
};
const Error = (props) => {
  return <></>;
};
const router = (menu) =>
  createBrowserRouter([
    {
      path: "/",
      element: <Layout menu={menu} />,
      errorElement: <Error />,
    },
  ]);

const checkMenuItem = (li, index, menu) => {
  expect(li.nodeName).toEqual("LI");
  const a = li.querySelector("a");
  const href = a.getAttributeNode("href");
  expect(href.value).toEqual(menu[index].path);
  const i = li.querySelector("i");
  const clazz = i.getAttributeNode("class");
  expect(clazz.value).toEqual(menu[index].icon);
  const re = new RegExp(`^\\s+${menu[index].title}$`);
  expect(li.textContent).toMatch(re);
}

describe("Sidebar renders the menu passed to it, including icons", () => {
  test("empty menu == empty sidebar", () => {
    const menu = [];

    const dom = render(<RouterProvider router={router(menu)} />);

    const ul = getById(dom.container, "menuItems");
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

    const dom = render(<RouterProvider router={router(menu)} />);

    const ul = getById(dom.container, "menuItems");
    expect(ul.childElementCount).toEqual(menu.length);
    ul.childNodes.forEach((li, index) => {
      checkMenuItem(li, index, menu);
    });
  });

  test("5 menu item", () => {
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

    const dom = render(<RouterProvider router={router(menu)} />);

    const ul = getById(dom.container, "menuItems");
    expect(ul.childElementCount).toEqual(menu.length);
    ul.childNodes.forEach((li, index) => {
      checkMenuItem(li, index, menu);
    });
  });
});
