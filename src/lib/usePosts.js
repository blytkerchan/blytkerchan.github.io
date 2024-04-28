import { createGlobalState } from "react-hooks-global-state";
const initialState = { posts: {}, fetched: false, postList: [] };
const { useGlobalState } = createGlobalState(initialState);

export default function usePosts() {
  const [posts, setPosts] = useGlobalState("posts");
  const [fetched, setFetched] = useGlobalState("fetched");
  const [postList, setPostList] = useGlobalState("postList");

  const fetchPosts = (env) => {
    if (!fetched) {
      setFetched(true);
      return fetch(env.indexEndpoint)
        .then((res) => res.json())
        .then((posts) =>
          posts.map((post) => ({ [post.locallink]: post })).reduce((acc, obj) => Object.assign(acc, obj), {})
        )
        .then((posts) => {
          setPosts(posts);
          setPostList(Object.values(posts));
        });
    } else {
      return Promise.resolve();
    }
  };
  const listPosts = () => {
    return postList;
  };
  const findPost = (key) => {
    return posts[key];
  };

  return {
    fetchPosts,
    listPosts,
    findPost,
  };
}
