import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

import { Button } from "react-bootstrap";

import useTitle from "../lib/useTitle";

import remarkLink from "../remark/links";
import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";

import usePosts from "../lib/usePosts";
import { useTranslation } from "react-i18next";

const Posts = ({ env }) => {
  const { t } = useTranslation();
  const { setSubtitle } = useTitle();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState({ page: 0, pagePosts: [] });
  const [ready, setReady_] = useState(false);
  const setReady = () => setReady_(true);

  const the_posts = usePosts();

  setSubtitle(t("Home"));

  useEffect(() => {
    if (currentPage.pagePosts.length === 0) {
      const posts = the_posts.listPosts();
      currentPage.pagePosts = posts.slice(
        currentPage.page * env.pageSize,
        currentPage.page * env.pageSize + env.pageSize
      );
    }

    setPosts(currentPage.pagePosts);
    setReady();
    document.getElementById("scrollBox").scroll({ top: 0, behavior: "smooth" });
  }, [currentPage, the_posts, env]);

  const handleOlder = (e) => {
    setCurrentPage({ page: currentPage.page + 1, pagePosts: [] });
  };
  const handleNewer = (e) => {
    setCurrentPage({ page: currentPage.page - 1, pagePosts: [] });
  };

  if (ready) {
    return (
      <div id="posts">
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
                remarkPlugins={[remarkImages, remarkGfm, remarkMath, remarkLink]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                  a: (props) => {
                    if (!("target" in props)) {
                      return <Link to={props.href}>{props.children}</Link>;
                    } else {
                      var newProps = {};
                      Object.keys(props).forEach((prop) => {
                        if (prop != "children") {
                          newProps[prop] = props[prop];
                        }
                      });
                      return <a {...newProps}>{props.children}</a>;
                    }
                  },
                }}
              >
                {excerpt}
              </Markdown>
              <span className="post-more-link">
                <Link className="post-more-link" to={locallink}>
                  {t("more...")}
                </Link>
              </span>
            </li>
          ))}
        </ul>
        <div style={{ paddingTop: "20px" }}>
          <Button
            variant="secondary"
            onClick={handleOlder}
            disabled={currentPage.page === Math.floor(the_posts.listPosts().length / env.pageSize)}
          >
            {t("Older")}
          </Button>
          <Button variant="primary" onClick={handleNewer} disabled={currentPage.page === 0} className="float-end">
            {t("Newer")}
          </Button>
        </div>
      </div>
    );
  } else {
    return <Spinner id="spinner" />;
  }
};

export default Posts;
