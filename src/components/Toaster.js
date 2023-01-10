import useError from "../lib/useError";
import Toast from "react-bootstrap/Toast";

const Toaster = (props) => {
  const { error, clearError } = useError();

  return (
    <>
      <Toast
        show={error.show}
        role="alert"
        onClose={clearError}
        style={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}
        className="text-bg-danger"
        delay={5000}
        autohide
      >
        <Toast.Header>
          <span style={{ marginRight: "auto", fontWeight: "bold" }}>{error.title}</span>
        </Toast.Header>
        <Toast.Body>{error.message}</Toast.Body>
      </Toast>
    </>
  );
};
export default Toaster;
