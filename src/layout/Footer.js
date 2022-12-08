const Footer = (props) => {
  return (
    <>
      <footer className="footer fixed-bottom mt-auto py-3 bg-light">
        <div className="container">
          <span className="text-muted">{props.children}</span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
