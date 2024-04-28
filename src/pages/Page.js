import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";

import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";

const Page = (props) => {
  const [contents, setContents] = useState("");

  useEffect(() => {
    fetch(`/${props.name}.md`)
      .then((res) => res.text())
      .then((text) => setContents(text));
  });

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
