import { NavLink } from "react-router-dom";

const Sidebar = (props) => {
  return (
    <div className="d-flex flex-column flex-shrink-0" style={{ width: 286 }}>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to={"/"} className="nav-link" aria-current="page">
            <i className="bi-house"></i>&nbsp; Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={"/dashboard"} className="nav-link">
            <i className="bi-speedometer"></i>&nbsp; Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={"/orders"} className="nav-link">
            <i className="bi-table"></i>&nbsp; Orders
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={"/products"} className="nav-link">
            <i className="bi-grid"></i>&nbsp; Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to={"/customers"} className="nav-link">
            <i className="bi-people"></i>&nbsp; Customers
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
