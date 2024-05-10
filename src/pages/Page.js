import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useTitle from "../lib/useTitle";
import Spinner from "../layout/Spinner";

import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";

const Page = (props) => {
  const [contents, setContents] = useState("");

  const { t } = useTranslation();
  const { setSubtitle } = useTitle();
  const [ready, setReady_] = useState(false);
  const setReady = () => setReady_(true);

  useEffect(() => {
    setSubtitle(t(`pages:${props.name}`));
    fetch(`/${props.name}.md`)
      .then((res) => res.text())
      .then((text) => setContents(text))
      .then(() => setReady());
  });

  if (ready) {
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
  } else {
    return <Spinner id="spinner" />;
  }
};

export default Page;
