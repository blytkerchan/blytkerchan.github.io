import { NavLink } from "react-router-dom";
import { withTranslation } from "react-i18next";

import "./Sidebar.css";

export const Sidebar = ({ t, menu }) => {
  return (
    <div className="d-flex flex-column flex-shrink-0" style={{ width: 286 }}>
      <ul className="nav nav-pills flex-column mb-auto" id="menuItems">
        {menu.map((menuItem, index) => {
          if (typeof menuItem.children === "undefined") {
            return (
              <li key={index} className="nav-item">
                <NavLink to={menuItem.path} className="nav-link">
                  <i className={menuItem.icon}></i>&nbsp;{t(menuItem.title)}
                </NavLink>
              </li>
            );
          } else {
            return (
              <li key={index}>
                <div className="accordion-item" style={{ whiteSpace: "nowrap", border: "none" }}>
                  <span className="accordion-header" id={"heading" + index}>
                    <div
                      className="accordion-button collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target={"#collapse" + index}
                      aria-controls={"#collapse" + index}
                      style={{ padding: "4px 16px" }}
                    >
                      <i className={menuItem.icon}></i>&nbsp;{t(menuItem.title)}
                    </div>
                  </span>
                  <div
                    id={"collapse" + index}
                    className="accordion-collapse collapse"
                    aria-labelledby={"heading" + index}
                    data-bs-parent="#menuItems"
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
                              <NavLink className="dropdown-item" to={child.path}>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <i className={child.icon}></i>&nbsp;
                                {t(child.title)}
                              </NavLink>
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
  );
};

export default withTranslation()(Sidebar);
