import React from "react";
import { useLocation } from "react-router-dom";

import useElementDimensions from "../lib/useElementDimensions";

const Asset = ({ env }) => {
  const location = useLocation();
  var locallink = null;
  if (env.useHashRouting) {
    locallink = location.hash.substring(1);
  } else {
    locallink = location.pathname;
  }
  const filenameRegex = /^.*\/([^\/]+)$/;
  const extRegex = /^.*(\.[^\.]+)$/;

  const extMatches = locallink.match(extRegex);
  const filenameMatches = locallink.match(filenameRegex);
  if (extMatches.length == 2 && [".png", ".jpg", ".svg", ".jpeg"].includes(extMatches[1].toLowerCase())) {
    return <img src={locallink} width="100%" />;
  } else if (extMatches.length == 2 && [".mp3"].includes(extMatches[1].toLowerCase())) {
    return (
      <audio controls>
        <source src={locallink} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    );
  } else if (extMatches.length == 2 && [".pdf"].includes(extMatches[1].toLowerCase())) {
    const { width: scrollWidth, height: scrollHeight } = useElementDimensions(document.getElementById("scrollBox"));
    const { width: contentWidth, height: contentHeight } = useElementDimensions(document.getElementById("contentBox"));
    return (
      <div style={{ height: scrollHeight - 56 }}>
        <object data={locallink} type="application/pdf" width={contentWidth - 16} height={scrollHeight - 56}></object>
      </div>
    );
  } else {
    fetch(locallink, {
      method: "GET",
      headers: {
        "Content-Type": "application/binary",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filenameMatches[1]}`);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });

    return (
      <>
        The file <b>{filenameMatches[1]}</b> cannot be shown here and is being downloaded.
      </>
    );
  }
};

export default Asset;
