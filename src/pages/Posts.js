import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";

import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";

import usePosts from "../lib/usePosts";

const { t } = require("i18next");

const Posts = ({ env }) => {
  const [posts, setPosts] = useState([]);

  const the_posts = usePosts();

  useEffect(() => {
    document.title = env.title;
    setPosts(the_posts.listPosts());
  }, [the_posts, env, env.title]);

  return (
    <>
      <h2 className="post-list-heading">{t("Posts")}</h2>
      <ul className="post-list">
        {posts.map(({ title, permalink, locallink, excerpt, date }) => (
          <li key={permalink}>
            <span className="post-meta">{new Date(Date.parse(date)).toLocaleDateString()}</span>
            <h3>
              <Link className="post-link" to={locallink}>
                {title}
              </Link>
            </h3>

            <Markdown
              remarkPlugins={[remarkImages, remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              components={{
                a: (props) => <Link to={props.href}>{props.children}</Link>,
              }}
            >
              {excerpt}
            </Markdown>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Posts;
