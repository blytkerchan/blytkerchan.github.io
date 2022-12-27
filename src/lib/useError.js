import { createGlobalState } from "react-hooks-global-state";
const initialState = { error: { show: false } };
const { useGlobalState, getGlobalState, setGlobalState, subscribe } =
  createGlobalState(initialState);

const errorTitles = {
  AuthenticationError: "Authentication error",
  EvalError: "Internal error",
  RangeError: "Internal error",
  ReferenceError: "Internal error",
  SyntaxError: "Internal error",
  TypeError: "Internal error",
  URIError: "Internal error",
};

export default function useError() {
  const [error, setError] = useGlobalState("error");

  const reportError = (error) => {
    if (typeof error !== "undefined" && error !== null) {
      if (typeof error.title !== "string" || error.title === null) {
        if (!Object.keys(errorTitles).includes(error.name)) {
          error.title = "Error";
        } else {
          error.title = errorTitles[error.name];
        }
      }
      setError({ title: error.title, message: error.message, show: true });
    }
  };

  const clearError = () => {
    setError({ show: false });
  };

  return {
    setError: reportError,
    error,
    clearError,
  };
}
