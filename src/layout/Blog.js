import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import usePosts from "../lib/usePosts";
import useTitle from "../lib/useTitle";
import Spinner from "./Spinner";

import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";

import { Link, useLocation } from "react-router-dom";
import ReactEmbedGist from "react-embed-gist";

const Page = ({ env }) => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const posts = usePosts();
  const { setSubtitle } = useTitle();
  const [ready, setReady_] = useState(false);
  const setReady = () => setReady_(true);

  const location = useLocation();
  var locallink = null;

  if (env.useHashRouting) {
    locallink = location.hash.substring(1);
  } else {
    locallink = location.pathname;
  }

  useEffect(() => {
    if (posts.fetched) {
      const post = posts.findPostByLocalLink(locallink);
      if (!post) {
        // 404 error
      } else {
        setTitle(post.title);
        setSubtitle(post.title);
        if (!post.contents) {
          if (!post.status || (post.status != "fetching" && post.stauts != "fetched")) {
            post.status = "fetching";
            fetch(`/_posts/${post.filename}`)
              .then((res) => {
                return res.text();
              })
              .then((contents) => {
                post.contents = contents;
                post.status = "fetched";
                setContents(contents);
                setReady();
              });
          }
        } else {
          setContents(post.contents);
          setReady();
        }
      }
    }
  }, []);

  if (ready) {
    return (
      <>
        <h1 className="post-title">{title}</h1>
        <Markdown
          remarkPlugins={[remarkImages, remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={{
            a: (props) => <Link to={props.href}>{props.children}</Link>,
            gist: (props) => (
              <ReactEmbedGist gist={props.id} file={props.file} loadingFallback={<Spinner />}></ReactEmbedGist>
            ),
          }}
        >
          {contents}
        </Markdown>
      </>
    );
  } else {
    return <Spinner id="spinner" />;
  }
};

export default Page;
