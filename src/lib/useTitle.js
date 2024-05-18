import { createGlobalState } from "react-hooks-global-state";
import environment from "../config/environment";
const initialState = { title: environment.title };
const { useGlobalState } = createGlobalState(initialState);

export default function useTitle() {
  const [title, setTitle] = useGlobalState("title");

  const setSubtitle = (subtitle) => {
    setTitle(`${environment.title} - ${subtitle}`);
  };

  const clearError = () => {
    setError({ show: false });
  };

  return {
    title,
    setTitle,
    setSubtitle,
  };
}
