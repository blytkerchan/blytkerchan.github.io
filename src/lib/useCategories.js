import { createGlobalState } from "react-hooks-global-state";
const initialState = { categories: {}, categoryCounts: {}, sortedCategories: [], fetched: false };
const { useGlobalState } = createGlobalState(initialState);
import useError from "../lib/useError";

export default function usePosts() {
  const [categories, setCategories] = useGlobalState("categories");
  const [categoryCounts, setCategoryCounts] = useGlobalState("categoryCounts");
  const [sortedCategories, setSortedCategories] = useGlobalState("sortedCategories");
  const [fetched, setFetched] = useGlobalState("fetched");

  const { setError } = useError();

  const fetchCategories = (env) => {
    if (!fetched) {
      setFetched(true);
      return fetch(env.categoriesEndpoint)
        .then((res) => res.json())
        .then((categories) => {
          Object.keys(categories).forEach((slug) => (categories[slug]["slug"] = slug));
          setCategories(categories);
          const categoryCounts = Object.fromEntries(
            Object.entries(categories)
              .filter(([k, v]) => v["posts"].length > env.minPostsPerCategory)
              .map(([k, v]) => [k, v["posts"].length])
          );
          setCategoryCounts(categoryCounts);
          return categoryCounts;
        })
        .then((categoryCounts) => Object.entries(categoryCounts).sort((first, second) => second[1] - first[1]))
        .then((sortedCategoryCountKVP) => {
          const sortedCategories = sortedCategoryCountKVP.map((kvp) => kvp[0]);
          console.log(sortedCategories);
          return sortedCategories;
        })
        .then((sortedCategories) => setSortedCategories(sortedCategories))
        .catch((err) => {
          setError(err);
        });
    } else {
      return Promise.resolve();
    }
  };
  const listCategories = () => {
    return sortedCategories;
  };
  const getCategoryCount = (cat) => {
    return categoryCounts[cat];
  };
  const getCategoryPosts = (cat) => {
    return categories[cat]["posts"];
  };
  const getCategoryName = (cat) => {
    return categories[cat]["name"];
  };

  const categoryExists = (cat) => {
    return cat in categories;
  };

  return {
    fetchCategories,
    listCategories,
    getCategoryCount,
    getCategoryPosts,
    getCategoryName,
    categoryExists,
  };
}
