import { useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Error = (props) => {
  const { t } = useTranslation();

  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>{t("Oops!")}</h1>
      <p>{t("Sorry, an unexpected error has occurred.")}</p>
      <p>
        <i>{t(`error.${error.status}`) || t(error.message)}</i>
      </p>
    </div>
  );
};

export default Error;
