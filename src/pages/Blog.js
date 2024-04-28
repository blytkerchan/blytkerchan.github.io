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
  const [contents, setContents] = useState("");
  const posts = usePosts();

  const location = useLocation();
  var permalink = null;

  if (env.useHashRouting) {
    permalink = location.hash.substring(1);
  } else {
    permalink = location.pathname;
  }

  useEffect(() => {
    fetch(`/_posts/${posts.findPost(permalink).filename}`)
      .then((res) => {
        console.log(res);
        return res.text();
      })
      .then((contents) => setContents(contents));
  }, [permalink, posts]);

  return (
    <Markdown
      remarkPlugins={[remarkImages, remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={{
        a: (props) => <Link to={props.href}>{props.children}</Link>,
      }}
    >
      {contents}
    </Markdown>
  );
};

export default Page;
