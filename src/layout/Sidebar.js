import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Sidebar = (props) => {
  const menu = props.menu;
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-column flex-shrink-0" style={{ width: 286 }}>
      <ul className="nav nav-pills flex-column mb-auto" id="menuItems">
        {menu.map((menuItem, index) => {
          return (
            <li key={index} className="nav-item">
              <NavLink to={menuItem.path} className="nav-link">
                <i className={menuItem.icon}></i>&nbsp;{t(menuItem.title)}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
