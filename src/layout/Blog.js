import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import usePosts from "../lib/usePosts";
import useTitle from "../lib/useTitle";
import Spinner from "./Spinner";

import useError from "../lib/useError";

import remarkLink from "../remark/links";
import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";

import { Link, useLocation } from "react-router-dom";
import ReactEmbedGist from "react-embed-gist";

const Blog = ({ env }) => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const posts = usePosts();
  const { setSubtitle } = useTitle();
  const [ready, setReady_] = useState(false);
  const [bail, setBail_] = useState(false);
  const [notFound, setNotFound_] = useState(false);
  const setReady = () => setReady_(true);
  const setBail = () => setBail_(true);
  const set404 = () => setNotFound_(true);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const location = useLocation();
  var locallink = null;

  if (env.useHashRouting) {
    locallink = location.hash.substring(1);
  } else {
    locallink = location.pathname;
  }

  const { setError } = useError();

  useEffect(() => {
    if (posts.fetched) {
      const post = posts.findPostByLocalLink(locallink);
      if (!post) {
        set404();
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
              })
              .catch((err) => {
                setError(err);
                setBail();
                navigate(-1);
              });
          }
        } else {
          setContents(post.contents);
          setReady();
        }
      }
    }
  }, []);

  if (bail) {
    return redirectDocument("/");
  } else if (notFound) {
    return (
      <>
        <h1>{t("Not found")}</h1>
        <p>{t("It looks like you've found a broken permalink - or perhaps you mis-typed the URL?")}</p>
        <Link to="/">{t("Take me back!")}</Link>
        <div className="h-100 d-flex align-items-center justify-content-center" style={{ minHeight: "75vh" }}>
          <img src="/404.png" width="75%" />
        </div>
      </>
    );
  } else if (ready) {
    return (
      <>
        <h1 className="post-title">{title}</h1>
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

export default Blog;
