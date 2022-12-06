function Header(props) {
	return (
  <div className="container">
    <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
	<img src={props.logoLocation} style={{height: 36}}/>&nbsp;<span className="fs-4">{props.name}</span>
      </a>
    </header>
  </div>
	);
}

export default Header;
