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

import useCategories from "../lib/useCategories";
import { useTranslation } from "react-i18next";

const Category = ({ env }) => {
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState("");
  const [posts, setPosts] = useState([]);

  const theCategories = useCategories();
  const thePosts = usePosts();
  const [ready, setReady_] = useState(false);
  const setReady = () => setReady_(true);

  const location = useLocation();
  var slug = null;

  if (env.useHashRouting) {
    slug = location.hash.substring(1).substring("/category/".length);
  } else {
    slug = location.pathname.substring("/category/".length);
  }

  const { setSubtitle } = useTitle();

  useEffect(() => {
    setCategoryName(theCategories.getCategoryName(slug));
    setSubtitle(theCategories.getCategoryName(slug));
    const postUUIDs = theCategories.getCategoryPosts(slug);
    var posts = [];
    postUUIDs.forEach((post) => {
      posts.push(thePosts.findPostByUUID(post));
    });
    posts.sort((lhs, rhs) => {
      const a = rhs.date;
      const b = lhs.date;
      if (a === b) {
        return 0;
      }

      if (a > b) {
        return 1;
      }

      return -1;
    });
    setPosts(posts);
    setReady();
    document.getElementById("scrollBox").scroll({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (ready) {
    return (
      <div id="category-posts">
        <h2 className="post-list-heading">{t(categoryName)}</h2>
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
              <span className="post-more-link">
                <Link className="post-more-link" to={locallink}>
                  {t("more...")}
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return <Spinner id="spinner" />;
  }
};

export default Category;
