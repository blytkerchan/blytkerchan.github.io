import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    let tokenString = sessionStorage.getItem("token");
    if (tokenString === null) {
      tokenString = localStorage.getItem("token");
    }
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = ({ token, remember }) => {
    if (typeof token !== "undefined" && token !== null) {
      if (remember) {
        localStorage.setItem("token", JSON.stringify(token));
      } else {
        sessionStorage.setItem("token", JSON.stringify(token));
      }
      setToken(token.token);
    }
  };

  return {
    setToken: saveToken,
    token,
  };
}
