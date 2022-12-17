import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";

const UserInfo = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t("Log in")}</h2>
      <Markdown
        components={{
          a: (props) => <Link to={props.href}>{props.children}</Link>,
        }}
      >
        {t("common:boilerplate.login-agreement", {
          applicationName: t("title"),
        })}
      </Markdown>
    </>
  );
};

export default UserInfo;
