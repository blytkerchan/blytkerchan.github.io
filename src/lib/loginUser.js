import { RemoteError } from "./RemoteError";

export async function _loginUser({ env, credentials }) {
  const result = await fetch(env.loginEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const resultAsJson = await result.json();
  if (result.ok) {
    return resultAsJson;
  } else {
    throw new RemoteError(resultAsJson);
  }
}

export function withLoginUser(WrappedComponent, additionalProps) {
  return function (props) {
    const { loginUser, ...otherProps } = props;
    return <WrappedComponent loginUser={_loginUser} {...otherProps} {...additionalProps} />;
  };
}
