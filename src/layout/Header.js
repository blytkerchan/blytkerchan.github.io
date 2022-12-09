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
              <ul className="dropdown-menu text-small shadow" id="userMenuItems">
                {userMenu.map((menuItem, index) => {
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
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
