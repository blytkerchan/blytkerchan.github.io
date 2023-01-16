import { Login } from "./Login";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StaticRouter } from "react-router-dom/server";

describe("Login component", () => {
  it("Renders", async () => {
    function setError() {}
    function setToken() {}
    function loginUser() {}
    const setErrorSpy = jest.fn(setError);
    const setTokenSpy = jest.fn(setToken);
    const loginUserSpy = jest.fn(loginUser);
    render(
      <Login
        t={(key) => key}
        setToken={setTokenSpy}
        loginUser={loginUserSpy}
        useError={() => {
          return { setError: setErrorSpy };
        }}
      />
    );
    const emailTextbox = await screen.findByRole("textbox", { name: /^E-mail/ });
    const passwordTextbox = await screen.findByTestId("passwordInput");
    const rememberMeCheckbox = await screen.findByRole("checkbox", { name: /^Remember/ });
    const cancelButton = await screen.findByRole("button", { name: /^Cancel/ });
    const submitButton = await screen.findByRole("button", { name: /^Submit/ });
    expect(emailTextbox).not.toBeNull();
    expect(emailTextbox).not.toBeUndefined();
    expect(passwordTextbox).not.toBeNull();
    expect(passwordTextbox).not.toBeUndefined();
    expect(rememberMeCheckbox).not.toBeNull();
    expect(rememberMeCheckbox).not.toBeUndefined();
    expect(cancelButton).not.toBeNull();
    expect(cancelButton).not.toBeUndefined();
    expect(submitButton).not.toBeNull();
    expect(submitButton).not.toBeUndefined();
    expect(loginUserSpy).not.toBeCalled();
    expect(setTokenSpy).not.toBeCalled();
    expect(setErrorSpy).not.toBeCalled();
  });
  it("Doesn't try to call out when canceled", async () => {
    function setError() {}
    function setToken() {}
    function loginUser() {}
    const setErrorSpy = jest.fn(setError);
    const setTokenSpy = jest.fn(setToken);
    const loginUserSpy = jest.fn(loginUser);
    render(
      <Login
        t={(key) => key}
        setToken={setTokenSpy}
        loginUser={loginUserSpy}
        useError={() => {
          return { setError: setErrorSpy };
        }}
      />
    );
    const form = await screen.findByTestId("theLoginForm");
    expect(form).toBeVisible();
    const cancelButton = await screen.findByRole("button", { name: /^Cancel/ });
    await userEvent.click(cancelButton);
    await waitFor(() => {
      expect(form).not.toBeVisible();
    });
    expect(loginUserSpy).not.toBeCalled();
    expect(setTokenSpy).not.toBeCalled();
    expect(setErrorSpy).not.toBeCalled();
  });
  it("Calls out when submitted", async () => {
    function setError() {}
    function setToken() {}
    function loginUser() {}
    const setErrorSpy = jest.fn(setError);
    const setTokenSpy = jest.fn(setToken);
    const loginUserSpy = jest.fn(loginUser);
    render(
      <Login
        t={(key) => key}
        setToken={setTokenSpy}
        loginUser={loginUserSpy}
        useError={() => {
          return { setError: setErrorSpy };
        }}
      />
    );
    const form = await screen.findByTestId("theLoginForm");
    expect(form).toBeVisible();
    const submitButton = await screen.findByRole("button", { name: /^Submit/ });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(form).not.toBeVisible();
    });
    expect(loginUserSpy).toBeCalledTimes(1);
    expect(setTokenSpy).toBeCalledTimes(1);
    expect(setErrorSpy).not.toBeCalled();
  });
  it("Sends the submitted data (1)", async () => {
    function setError() {}
    function setToken({ token, remember }) {
      expect(Object.keys(token).includes("token")).toBeTruthy();
      expect(token.token).toStrictEqual("f55b20f9-87bd-4186-b6c6-1d485f8772ad");
      expect(remember).toBeFalsy();
    }
    async function loginUser({ env, credentials }) {
      expect(Object.keys(credentials).includes("username")).toBeTruthy();
      expect(Object.keys(credentials).includes("password")).toBeTruthy();
      expect(credentials.username).toStrictEqual("Someone@SomeDomain.com");
      expect(credentials.password).toStrictEqual("1VeryComplexPassword!");
      return { token: "f55b20f9-87bd-4186-b6c6-1d485f8772ad" };
    }
    const setErrorSpy = jest.fn(setError);
    const setTokenSpy = jest.fn(setToken);
    const loginUserSpy = jest.fn(loginUser);
    render(
      <Login
        t={(key) => key}
        setToken={setTokenSpy}
        loginUser={loginUserSpy}
        useError={() => {
          return { setError: setErrorSpy };
        }}
      />
    );
    const form = await screen.findByTestId("theLoginForm");
    expect(form).toBeVisible();
    const emailTextbox = await screen.findByRole("textbox", { name: /^E-mail/ });
    const passwordTextbox = await screen.findByTestId("passwordInput");
    const submitButton = await screen.findByRole("button", { name: /^Submit/ });

    await userEvent.type(emailTextbox, "Someone@SomeDomain.com");
    await userEvent.type(passwordTextbox, "1VeryComplexPassword!");
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(form).not.toBeVisible();
    });
    expect(loginUserSpy).toBeCalledTimes(1);
    expect(setTokenSpy).toBeCalledTimes(1);
    expect(setErrorSpy).not.toBeCalled();
  });
  it("Sends the submitted data (2)", async () => {
    function setError() {
      console.log(arguments);
    }
    function setToken({ token, remember }) {
      expect(Object.keys(token).includes("token")).toBeTruthy();
      expect(token.token).toStrictEqual("f55b20f9-87bd-4186-b6c6-1d485f8772ad");
      expect(remember).toBeTruthy();
    }
    async function loginUser({ env, credentials }) {
      expect(Object.keys(credentials).includes("username")).toBeTruthy();
      expect(Object.keys(credentials).includes("password")).toBeTruthy();
      expect(credentials.username).toStrictEqual("Someone@SomeDomain.com");
      expect(credentials.password).toStrictEqual("1VeryComplexPassword!");
      return { token: "f55b20f9-87bd-4186-b6c6-1d485f8772ad" };
    }
    const setErrorSpy = jest.fn(setError);
    const setTokenSpy = jest.fn(setToken);
    const loginUserSpy = jest.fn(loginUser);
    render(
      <Login
        t={(key) => key}
        setToken={setTokenSpy}
        loginUser={loginUserSpy}
        useError={() => {
          return { setError: setErrorSpy };
        }}
      />
    );
    const form = await screen.findByTestId("theLoginForm");
    expect(form).toBeVisible();
    const emailTextbox = await screen.findByRole("textbox", { name: /^E-mail/ });
    const passwordTextbox = await screen.findByTestId("passwordInput");
    const submitButton = await screen.findByRole("button", { name: /^Submit/ });
    const rememberMeCheckbox = await screen.findByRole("checkbox", { name: /^Remember/ });

    await userEvent.type(emailTextbox, "Someone@SomeDomain.com");
    await userEvent.type(passwordTextbox, "1VeryComplexPassword!");
    await userEvent.click(rememberMeCheckbox);
    await waitFor(() => {
      expect(rememberMeCheckbox).toBeChecked();
    });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(form).not.toBeVisible();
    });
    expect(loginUserSpy).toBeCalledTimes(1);
    expect(setTokenSpy).toBeCalledTimes(1);
    expect(setErrorSpy).not.toBeCalled();
  });
  it("Sends the submitted data (3)", async () => {
    function setError() {
      console.log(arguments);
    }
    function setToken({ token, remember }) {
      expect(Object.keys(token).includes("token")).toBeTruthy();
      expect(token.token).toStrictEqual("f55b20f9-87bd-4186-b6c6-1d485f8772ad");
      expect(remember).toBeFalsy();
    }
    async function loginUser({ env, credentials }) {
      expect(Object.keys(credentials).includes("username")).toBeTruthy();
      expect(Object.keys(credentials).includes("password")).toBeTruthy();
      expect(credentials.username).toStrictEqual("Someone@SomeDomain.com");
      expect(credentials.password).toStrictEqual("1VeryComplexPassword!");
      return { token: "f55b20f9-87bd-4186-b6c6-1d485f8772ad" };
    }
    const setErrorSpy = jest.fn(setError);
    const setTokenSpy = jest.fn(setToken);
    const loginUserSpy = jest.fn(loginUser);
    render(
      <Login
        t={(key) => key}
        setToken={setTokenSpy}
        loginUser={loginUserSpy}
        useError={() => {
          return { setError: setErrorSpy };
        }}
      />
    );
    const form = await screen.findByTestId("theLoginForm");
    expect(form).toBeVisible();
    const emailTextbox = await screen.findByRole("textbox", { name: /^E-mail/ });
    const passwordTextbox = await screen.findByTestId("passwordInput");
    const submitButton = await screen.findByRole("button", { name: /^Submit/ });
    const rememberMeCheckbox = await screen.findByRole("checkbox", { name: /^Remember/ });

    await userEvent.type(emailTextbox, "Someone@SomeDomain.com");
    await userEvent.type(passwordTextbox, "1VeryComplexPassword!");
    await userEvent.click(rememberMeCheckbox);
    await waitFor(() => {
      expect(rememberMeCheckbox).toBeChecked();
    });
    await userEvent.click(rememberMeCheckbox, { target: { checked: false } });
    await waitFor(() => {
      expect(rememberMeCheckbox).not.toBeChecked();
    });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(form).not.toBeVisible();
    });
    expect(loginUserSpy).toBeCalledTimes(1);
    expect(setTokenSpy).toBeCalledTimes(1);
    expect(setErrorSpy).not.toBeCalled();
  });
  it("Gracefully handles errors from loginUser", async () => {
    function setError() {}
    function setToken() {}
    async function loginUser({ env, credentials }) {
      expect(Object.keys(credentials).includes("username")).toBeTruthy();
      expect(Object.keys(credentials).includes("password")).toBeTruthy();
      expect(credentials.username).toStrictEqual("Someone@SomeDomain.com");
      expect(credentials.password).toStrictEqual("1VeryComplexPassword!");
      throw Error("No network");
    }
    const setErrorSpy = jest.fn(setError);
    const setTokenSpy = jest.fn(setToken);
    const loginUserSpy = jest.fn(loginUser);
    render(
      <Login
        t={(key) => key}
        setToken={setTokenSpy}
        loginUser={loginUserSpy}
        useError={() => {
          return { setError: setErrorSpy };
        }}
      />
    );
    const form = await screen.findByTestId("theLoginForm");
    expect(form).toBeVisible();
    const emailTextbox = await screen.findByRole("textbox", { name: /^E-mail/ });
    const passwordTextbox = await screen.findByTestId("passwordInput");
    const submitButton = await screen.findByRole("button", { name: /^Submit/ });

    await userEvent.type(emailTextbox, "Someone@SomeDomain.com");
    await userEvent.type(passwordTextbox, "1VeryComplexPassword!");
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(form).not.toBeVisible();
    });
    expect(loginUserSpy).toBeCalledTimes(1);
    expect(setTokenSpy).not.toBeCalled();
    expect(setErrorSpy).toBeCalledTimes(1);
  });
  it("Gracefully handles errors from setToken", async () => {
    function setError() {}
    function setToken() {
      throw Error("Test error");
    }
    async function loginUser({ env, credentials }) {
      expect(Object.keys(credentials).includes("username")).toBeTruthy();
      expect(Object.keys(credentials).includes("password")).toBeTruthy();
      expect(credentials.username).toStrictEqual("Someone@SomeDomain.com");
      expect(credentials.password).toStrictEqual("1VeryComplexPassword!");
      return { token: "f55b20f9-87bd-4186-b6c6-1d485f8772ad" };
    }
    const setErrorSpy = jest.fn(setError);
    const setTokenSpy = jest.fn(setToken);
    const loginUserSpy = jest.fn(loginUser);
    render(
      <Login
        t={(key) => key}
        setToken={setTokenSpy}
        loginUser={loginUserSpy}
        useError={() => {
          return { setError: setErrorSpy };
        }}
      />
    );
    const form = await screen.findByTestId("theLoginForm");
    expect(form).toBeVisible();
    const emailTextbox = await screen.findByRole("textbox", { name: /^E-mail/ });
    const passwordTextbox = await screen.findByTestId("passwordInput");
    const submitButton = await screen.findByRole("button", { name: /^Submit/ });

    await userEvent.type(emailTextbox, "Someone@SomeDomain.com");
    await userEvent.type(passwordTextbox, "1VeryComplexPassword!");
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(form).not.toBeVisible();
    });
    expect(loginUserSpy).toBeCalledTimes(1);
    expect(setTokenSpy).toBeCalledTimes(1);
    expect(setErrorSpy).toBeCalledTimes(1);
  });
  it("Shows markdown and turns links to Links", async () => {
    function setError() {}
    function setToken() {}
    function loginUser() {}
    const setErrorSpy = jest.fn(setError);
    const setTokenSpy = jest.fn(setToken);
    const loginUserSpy = jest.fn(loginUser);
    render(
      <StaticRouter>
      <Login
        t={(key) => `[${key}](/key)`}
        setToken={setTokenSpy}
        loginUser={loginUserSpy}
        useError={() => {
          return { setError: setErrorSpy };
        }}
      />
      </StaticRouter>
    );
    const markdown = await screen.findByTestId("theMarkdown");
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access -- really need it this time
      const a = markdown.querySelector("a");
      expect(a).toHaveAttribute("href", "/key");
    });
  });
});
