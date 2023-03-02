import useError from "../lib/useError";
import Toast from "react-bootstrap/Toast";

export const Toaster = ({ useError }) => {
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
          <span data-testid="toasterTitle" style={{ marginRight: "auto", fontWeight: "bold" }}>{error.title}</span>
        </Toast.Header>
        <Toast.Body><span data-testid="toasterMessage">{error.message}</span></Toast.Body>
      </Toast>
    </>
  );
};
function ToasterHOC() {
  return Toaster({ useError });
}
export default ToasterHOC;
