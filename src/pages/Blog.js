import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import usePosts from "../lib/usePosts";

import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";

import { Link, useLocation } from "react-router-dom";

const Page = ({ env }) => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const posts = usePosts();

  const location = useLocation();
  var locallink = null;

  if (env.useHashRouting) {
    locallink = location.hash.substring(1);
  } else {
    locallink = location.pathname;
  }

  useEffect(() => {
    const post = posts.findPostByLocalLink(locallink);
    setTitle(post.title);
    fetch(`/_posts/${post.filename}`)
      .then((res) => {
        console.log(res);
        return res.text();
      })
      .then((contents) => setContents(contents));
  }, [locallink, posts]);

  return (
    <>
      <h1 className="post-title">{title}</h1>
      <Markdown
        remarkPlugins={[remarkImages, remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          a: (props) => <Link to={props.href}>{props.children}</Link>,
        }}
      >
        {contents}
      </Markdown>
    </>
  );
};

export default Page;
