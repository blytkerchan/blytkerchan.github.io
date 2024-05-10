import { createGlobalState } from "react-hooks-global-state";
const initialState = { postsByLocalLink: {}, postsByUUID: {}, fetched: false, postList: [] };
const { useGlobalState } = createGlobalState(initialState);

export default function usePosts() {
  const [postsByLocalLink, setPostsByLocalLink] = useGlobalState("postsByLocalLink");
  const [postsByUUID, setPostsByUUID] = useGlobalState("postsByUUID");
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
          setPostsByLocalLink(posts);
          const postList = Object.values(posts);
          setPostList(postList);
          return postList;
        })
        .then((posts) => posts.map((post) => ({ [post.uuid]: post })).reduce((acc, obj) => Object.assign(acc, obj), {}))
        .then((posts) => {
          setPostsByUUID(posts);
        });
    } else {
      return Promise.resolve();
    }
  };
  const listPosts = () => {
    return postList;
  };
  const findPostByLocalLink = (key) => {
    return postsByLocalLink[key];
  };
  const findPostByUUID = (key) => {
    return postsByUUID[key];
  };

  return {
    fetchPosts,
    listPosts,
    findPostByLocalLink,
    findPostByUUID,
    fetched,
  };
}
