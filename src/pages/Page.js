import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";

const Page = (props) => {
  const { t } = useTranslation();

  const [contents, setContents] = useState("");

  useEffect(() => {
    fetch(`/${props.name}.md`)
      .then((res) => res.text())
      .then((text) => setContents(text));
  });

  return (
    <Markdown
      components={{
        a: (props) => <Link to={props.href}>{props.children}</Link>,
      }}
    >
      {contents}
    </Markdown>
  );
};

export default Page;
