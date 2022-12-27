import { useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import env from "../config/environment";
import { Modal, Button } from "react-bootstrap";

import useError from "../lib/useError";

function loginUser(credentials) {
  return new Promise((resolve, reject) => {
    fetch(env.loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((result) => {
        if (result.ok) {
          result.json().then((resultAsJson) => {
            resolve(resultAsJson);
          });
        } else {
          return result.json().then((resultAsJson) => {
            reject(resultAsJson);
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const Login = ({ setToken }) => {
  const { t } = useTranslation();

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
        username,
        password,
      });
      setToken({ token, remember });
    } catch (err) {
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
            <Modal.Title>{t("Log in")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Markdown
              components={{
                a: (props) => <Link to={props.href}>{props.children}</Link>,
              }}
            >
              {t("common:boilerplate.login-agreement", {
                applicationName: t("app:title"),
              })}
            </Markdown>
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
                  onChange={(e) => setRemember(e.target.value)}
                  tabIndex={3}
                />
                <label
                  className="form-check-label"
                  htmlFor="rememberMeCheckbox"
                >
                  {t("Remember be")}
                </label>
              </div>
            </fieldset>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} tabIndex={5}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmit}
              tabIndex={4}
            >
              Submit
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

export default Login;
