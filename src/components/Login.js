import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";

import "./Login.css";

const Login = (props) => {
  const { t } = useTranslation();

  return (
    <div className="login-wrapper">
      <h2>{t("Log in")}</h2>
      <Markdown
        components={{
          a: (props) => <Link to={props.href}>{props.children}</Link>,
        }}
      >
        {t("common:boilerplate.login-agreement", {
          applicationName: t("app:title"),
        })}
      </Markdown>
      <form>
        <fieldset>
          <form>
            <div class="mb-3">
              <label for="emailInput" class="form-label">
                {t("E-mail address")}
              </label>
              <input
                type="email"
                class="form-control"
                id="emailInput"
                aria-describedby="emailHelp"
              />
              <div id="emailHelp" class="form-text">
                {t("We'll never share your email with anyone else.")}
              </div>
            </div>
            <div class="mb-3">
              <label for="passwordInput" class="form-label">
                {t("Password")}
              </label>
              <input type="password" class="form-control" id="passwordInput" />
            </div>
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="rememberMeCheckbox"
              />
              <label class="form-check-label" for="rememberMeCheckbox">
                {t("Remember be")}
              </label>
            </div>
            <button type="submit" class="btn btn-primary">
              {t("Submit")}
            </button>
          </form>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
