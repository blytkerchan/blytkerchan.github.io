import React, { useEffect, useState } from "react";

const { t } = require("i18next");

const Posts = ({ env }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
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
              <a className="post-link" href={locallink}>
                {title}
              </a>
            </h3>
            {excerpt}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Posts;
