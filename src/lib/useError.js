import { createGlobalState } from "react-hooks-global-state";
const initialState = { error: { show: false } };
const { useGlobalState, getGlobalState, setGlobalState, subscribe } =
  createGlobalState(initialState);

const errorTitles = {};

export default function useError() {
  const [error, setError] = useGlobalState("error");

  const reportError = (error) => {
    if (typeof error !== "undefined" && error !== null) {
      if (typeof error.title !== "string" || error.title === null) {
        if (!Object.keys(errorTitles).includes(error.name)) {
          error.title = "Error";
        } else {
          error.title = errorTitles[error.title];
        }
      }
      setError({ ...error, show: true });
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
