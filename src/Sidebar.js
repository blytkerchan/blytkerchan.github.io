function Sidebar() {
	return (
  <div className="d-flex flex-column flex-shrink-0 p-3" style={{width: 286}}>
    <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item">
        <a href="#" className="nav-link active" aria-current="page">
          <svg className="bi pe-none me-2" width="16" height="16"><use href="#home"/></svg>
          Home
        </a>
      </li>
      <li>
        <a href="#" className="nav-link">
          <svg className="bi pe-none me-2" width="16" height="16"><use href="#speedometer2"/></svg>
          Dashboard
        </a>
      </li>
      <li>
        <a href="#" className="nav-link">
          <svg className="bi pe-none me-2" width="16" height="16"><use href="#table"/></svg>
          Orders
        </a>
      </li>
      <li>
        <a href="#" className="nav-link">
          <svg className="bi pe-none me-2" width="16" height="16"><use href="#grid"/></svg>
          Products
        </a>
      </li>
      <li>
        <a href="#" className="nav-link">
          <svg className="bi pe-none me-2" width="16" height="16"><use href="#people-circle"/></svg>
          Customers
        </a>
      </li>
    </ul>
  </div>
	);
}

export default Sidebar;
