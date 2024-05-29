import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import environment from "./config/environment";

import useMeta from "./lib/useMeta";
import App from "./App";

import "./i18n";

import reportWebVitals from "./lib/reportWebVitals";

const { fetchMeta } = useMeta();
fetchMeta()
  .then((res) => {
    console.log(res);
    return res.json();
  })
  .then((meta) => {
    const headElement = document.getElementById("head");
    Object.keys(meta).forEach((key) => {
      if (key === "title") {
        const titleNode = document.createElement("title");
        const title = document.createTextNode(meta[key]);
        titleNode.appendChild(title);
        headElement.appendChild(titleNode);
      } else {
        const metaNode = document.createElement("meta");
        const nameAttribute = document.createAttribute("name");
        nameAttribute.value = key;
        const contentAttribute = document.createAttribute("content");
        contentAttribute.value = meta[key];
        metaNode.setAttributeNode(nameAttribute);
        metaNode.setAttributeNode(contentAttribute);
        headElement.appendChild(metaNode);
      }
    });
  });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (environment.env !== "production") {
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals(console.log);
}
