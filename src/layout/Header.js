import { Link } from "react-router-dom";

const Header = (props) => {
  return (
    <>
      <header className="py-3 mb-3 border-bottom">
        <div
          className="container-fluid d-grid gap-3 align-items-center"
          style={{gridTemplateColumns: "1fr 2fr"}}
        >
          <div className="dropdown">
            <Link
              to="/"
              className="d-flex align-items-center col-lg-4 mb-2 mb-lg-0 link-dark text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img src={props.logoLocation} style={{ height: 36 }} alt="logo" />
              &nbsp;
              <span className="vln-fullscreen-inline"><strong>Vlinder Software</strong></span>
            </Link>
            <ul className="dropdown-menu text-small shadow">
              <li>
                <Link className="dropdown-item active" to="/overview" aria-current="page">
                  Overview
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/inventory">
                  Inventory
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/customers">
                  Customers
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/products">
                  Products
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="/reports">
                  Reports
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/analytics">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center">
            <form className="w-100 me-3" role="search">
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
                aria-label="Search"
              />
            </form>

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
              <ul className="dropdown-menu text-small shadow">
                <li>
                  <Link className="dropdown-item" to="/newproject">
                    New project...
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/settings">
                    Settings
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="/signout">
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
