import { Link, NavLink } from "react-router-dom";

const Header = (props) => {
  const mainMenu = props.mainMenu;
  const userMenu = props.userMenu;
  return (
    <>
      <header className="py-3 border-bottom">
        <div
          className="container-fluid d-grid gap-3 align-items-center"
          style={{ gridTemplateColumns: "1fr 2fr" }}
        >
          <div className="dropdown vln-smallscreen-block">
            <Link
              to="/"
              className="d-flex align-items-center col-lg-4 mb-2 mb-lg-0 link-dark text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img src={props.logoLocation} style={{ height: 36 }} alt="logo" />
              &nbsp;
              <strong id="titleLabel">Vlinder Software</strong>
            </Link>
            <ul className="dropdown-menu text-small shadow" id="mainMenuItems">
              {mainMenu.map((menuItem, index) => {
                return (
                  <li key={index}>
                    <NavLink className="dropdown-item" to={menuItem.path}>
                      {menuItem.title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="dropdown vln-fullscreen-block">
            <Link
              to="/"
              className="d-flex align-items-center link-dark text-decoration-none"
            >
              <img src={props.logoLocation} style={{ height: 36 }} alt="logo" />
              &nbsp;
              <strong>Vlinder Software</strong>
            </Link>
          </div>

          <div className="d-flex flex-row-reverse align-items-center">
            <div className="flex-shrink-0 dropdown">
              <Link
                to="/user"
                className="d-block link-dark text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                <img
                  src="https://github.com/blytkerchan.png"
                  width="32"
                  height="32"
                  className="rounded-circle"
                  alt="blytkerchan"
                />
              </Link>
              <ul
                className="dropdown-menu text-small shadow accordion"
                id="userMenuItems"
              >
                {userMenu.map((menuItem, index) => {
                  if (typeof menuItem.children === "undefined") {
                    return (
                      <li key={index}>
                        <Link className="dropdown-item" to={menuItem.path}>
                          <i className={menuItem.icon}></i>&nbsp;
                          {menuItem.title}
                        </Link>
                      </li>
                    );
                  } else {
                    return (
                      <li key={index}>
                        <div
                          className="accordion-item"
                          style={{ whiteSpace: "nowrap", border: "none" }}
                        >
                          <span
                            className="accordion-header"
                            id={"heading" + index}
                          >
                            <div
                              className="accordion-button collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target={"#collapse" + index}
                              aria-controls={"collapse" + index}
                              style={{ padding: "4px 16px" }}
                            >
                              <i className={menuItem.icon}></i>&nbsp;
                              {menuItem.title}&nbsp;
                            </div>
                          </span>
                          <div
                            id={"collapse" + index}
                            className="accordion-collapse collapse"
                            aria-labelledby={"heading" + index}
                            data-bs-parent="#userMenuItems"
                          >
                            <div>
                              <ul
                                className="text-small"
                                style={{
                                  listStyle: "none",
                                  paddingInlineStart: "0",
                                }}
                                data-testid="childMenu"
                              >
                                {menuItem.children.map((child, childIndex) => {
                                  return (
                                    <li key={childIndex}>
                                      <Link
                                        className="dropdown-item"
                                        to={child.path}
                                      >
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <i className={child.icon}></i>&nbsp;
                                        {child.title}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
