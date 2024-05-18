import React from "react";

import { render, queryByAttribute, getByTestId } from "@testing-library/react";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Header } from "./Header";

const getById = queryByAttribute.bind(null, "id");

const Layout = (props) => {
  return (
    <>
      <Header mainMenu={props.mainMenu} userMenu={props.userMenu} t={(key) => key} />
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

const checkMenuItem = (li, index, menu, expectIcon) => {
  expect(li.nodeName).toEqual("LI");
  // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
  const a = li.querySelector("a");
  const href = a.getAttributeNode("href");
  // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
  if (menu[index].children?.length) {
    // eslint-disable-next-line testing-library/prefer-screen-queries -- if the item has children, I should be able to get its list of children and check them individually as menu items
    const ul = getByTestId(li, "childMenu");
    // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
    expect(ul.childElementCount).toEqual(menu[index].children.length);
    ul.childNodes.forEach((innerLi, innerIndex) => {
      // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
      checkMenuItem(innerLi, innerIndex, menu[index].children, true);
    });
  } else {
    expect(href.value).toEqual(menu[index].path);
    if (expectIcon) {
      // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
      const i = li.querySelector("i");
      const clazz = i.getAttributeNode("class");
      expect(clazz.value).toEqual(menu[index].icon);
      const re = new RegExp(`^\\s+${menu[index].title}$`);
      expect(li.textContent).toMatch(re);
    } else {
      const re = new RegExp(`^${menu[index].title}$`);
      expect(li.textContent).toMatch(re);
    }
  }
};

describe("Header renders the menu passed to it, excluding icons", () => {
  test("empty menu == empty menu", () => {
    const menu = [];

    const view = render(<RouterProvider router={router(menu, [])} />);

    const ul = getById(view.container, "mainMenuItems");
    // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
    expect(ul.childElementCount).toEqual(menu.length);
    ul.childNodes.forEach((li, index) => {
      checkMenuItem(li, index, menu, false);
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
      checkMenuItem(li, index, menu, false);
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
      checkMenuItem(li, index, menu, false);
    });
  });
});

describe("Header renders the user menu passed to it, including icons", () => {
  test("empty menu == empty menu", () => {
    const menu = [];

    const view = render(<RouterProvider router={router([], menu)} />);

    const ul = getById(view.container, "userMenuItems");
    // eslint-disable-next-line testing-library/no-node-access -- we really do want to check the structure here
    expect(ul.childElementCount).toEqual(menu.length);
    ul.childNodes.forEach((li, index) => {
      checkMenuItem(li, index, menu, true);
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
      checkMenuItem(li, index, menu, true);
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
      checkMenuItem(li, index, menu, true);
    });
  });

  test("Three items, one of which with two children", () => {
    const menu = [
      {
        path: "/",
        title: "Home",
        icon: "bi-house",
      },
      {
        title: "Dashboard",
        icon: "bi-speedometer",
        children: [
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
        ],
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
      checkMenuItem(li, index, menu, true);
    });
  });
});
