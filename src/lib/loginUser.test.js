import { expect, jest } from "@jest/globals";
import { _loginUser as loginUser, withLoginUser } from "./loginUser";
import { render } from "@testing-library/react";

global.fetch = jest.fn();

describe("loginUser", () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });
  it("Fails transparently on a network error", async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject({ name: "NetworkError", message: "No network" }));
    let caught = false;
    try {
      await loginUser({
        env: { loginEndpoint: "/api/v1/login" },
        credentials: { username: "ExampleUsername", password: "1VeryComplexPassword!" },
      });
    } catch (err) {
      caught = true;
      // eslint-disable-next-line jest/no-conditional-expect -- making sure it was run using the caught variable
      expect(err.name).toStrictEqual("NetworkError");
    }
    expect(caught).toBeTruthy();
    expect(global.fetch).toBeCalledTimes(1);
  });
  it("gracefully passes on remote errors", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ name: "AuthenticationError", message: "Authentication failed" }),
        status: 401,
      })
    );
    let caught = false;
    try {
      await loginUser({
        env: { loginEndpoint: "/api/v1/login" },
        credentials: { username: "ExampleUsername", password: "1VeryComplexPassword!" },
      });
    } catch (err) {
      caught = true;
      // eslint-disable-next-line jest/no-conditional-expect -- making sure it was run using the caught variable
      expect(err.name).toStrictEqual("AuthenticationError");
    }
    expect(caught).toBeTruthy();
    expect(global.fetch).toBeCalledTimes(1);
  });
  it("correctly handles success", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "4742656f-c444-4940-b449-3296cbc62836" }),
        status: 200,
      })
    );
    let caught = false;
    try {
      const result = await loginUser({
        env: { loginEndpoint: "/api/v1/login" },
        credentials: { username: "ExampleUsername", password: "1VeryComplexPassword!" },
      });
      expect(result.token).toStrictEqual("4742656f-c444-4940-b449-3296cbc62836");
    } catch (err) {
      caught = true;
    }
    expect(caught).toBeFalsy();
    expect(global.fetch).toBeCalledTimes(1);
  });
});
describe("withLoginUser", () => {
  it("adds the loginUser prop", async () => {
    const mockComponent = jest.fn(() => null);
    const Component = withLoginUser(mockComponent);

    render(<Component />);

    expect(mockComponent).toBeCalled();
    expect(mockComponent).toBeCalledWith(expect.objectContaining({ loginUser: loginUser }), expect.anything());
  });
  it("passes through other props", async () => {
    const mockComponent = jest.fn(() => null);
    const Component = withLoginUser(mockComponent);

    render(<Component potato />);

    expect(mockComponent).toBeCalled();
    expect(mockComponent).toBeCalledWith(expect.objectContaining({ potato: true }), expect.anything());
  });
  it("replaces the loginUser prop", async () => {
    const mockComponent = jest.fn(() => null);
    const Component = withLoginUser(mockComponent);

    render(<Component loginUser />);

    expect(mockComponent).toBeCalled();
    expect(mockComponent).toBeCalledWith(expect.objectContaining({ loginUser: loginUser }), expect.anything());
  });
});
