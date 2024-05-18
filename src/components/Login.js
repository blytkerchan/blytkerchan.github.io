import { useState } from "react";
import { withTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import env from "../config/environment";
import { Modal, Button } from "react-bootstrap";
import { withLoginUser } from "../lib/loginUser";
import useError from "../lib/useError";

export const Login = ({ setToken, t, loginUser, env, useError }) => {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [remember, setRemember] = useState(false);

  const { setError } = useError();

  const [cursor, setCursor] = useState("auto");

  const [show, setShow] = useState(true);

  const handleSubmit = async (e) => {
    try {
      setCursor("progress");
      e.preventDefault();
      const token = await loginUser({
        credentials: {
          username,
          password,
        },
        env,
      });
      setToken({ token, remember });
    } catch (err) {
      //TODO don't put this in the toaster
      setError(err);
    }
    setShow(false);
  };

  const handleClose = (e) => {
    setShow(false);
  };

  return (
    <>
      <Modal show={show} centered style={{ cursor: cursor }}>
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              <span data-testid="theLoginForm">{t("Log in")}</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span data-testid="theMarkdown">
              <Markdown
                components={{
                  a: (props) => <Link to={props.href}>{props.children}</Link>,
                }}
              >
                {t("common:boilerplate.login-agreement", {
                  applicationName: t("app:title"),
                })}
              </Markdown>
            </span>
            <fieldset>
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">
                  {t("E-mail address")}
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  aria-describedby="emailHelp"
                  onChange={(e) => setUserName(e.target.value)}
                  tabIndex={1}
                />
                <div id="emailHelp" className="form-text">
                  {t("We'll never share your email with anyone else.")}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">
                  {t("Password")}
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordInput"
                  data-testid="passwordInput"
                  onChange={(e) => setPassword(e.target.value)}
                  tabIndex={2}
                  autoFocus
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMeCheckbox"
                  onChange={(e) => setRemember(e.target.checked)}
                  tabIndex={3}
                />
                <label className="form-check-label" htmlFor="rememberMeCheckbox">
                  {t("Remember be")}
                </label>
              </div>
            </fieldset>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} tabIndex={5}>
              {t("Cancel")}
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit} tabIndex={4}>
              {t("Submit")}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default withTranslation()(withLoginUser(Login, { env, useError }));
