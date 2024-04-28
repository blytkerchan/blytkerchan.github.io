import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";

const { t } = require("i18next");

const Posts = ({ env }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.title = env.title;

    fetch(env.indexEndpoint)
      .then((res) => res.json())
      .then((posts) => setPosts(posts));
  }, [env.indexEndpoint]);

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
