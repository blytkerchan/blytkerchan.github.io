/* This file was copied and modified from https://raw.githubusercontent.com/ryanfiller/portfolio-svelte/main/src/plugins/remark/links.js,
   which is under MIT license by Ryan Filler (https://github.com/ryanfiller) */
import { visit } from "unist-util-visit";
import env from "../config/environment.js";
const baseUrl = env.baseUrl;

function transformer(ast) {
  visit(ast, "link", visitor);

  function visitor(node) {
    const data = node.data || (node.data = {});
    const props = data.hProperties || (data.hProperties = {});
    const url = node.url;

    const getLinkType = (url) => {
      // any string that starts with #
      if (/^#(.*)/.exec(url)) {
        return "hash";

        // any string that starts with /
      } else if (/^\/(.*)/.exec(url)) {
        return "relative";

        // any subdomain that is not www
      } else if (new RegExp(`((http://)|(https://))?^(?!www).*(${baseUrl})(.*)?`, "g").exec(url)) {
        return "subdomain";

        // any non-subdomain link
      } else if (url.includes(baseUrl)) {
        return "internal";

        // catch all the rest
      } else {
        return "external";
      }
    };

    const linkType = getLinkType(url);

    props.title = node.url;

    if (linkType === "relative") {
      // TODO sort this out for syndication, gonna need an ENV var here
      // node.url = siteUrl + url
      props.title = url === "/" ? baseUrl : baseUrl + url;
    }

    if (linkType === "external" || linkType === "subdomain") {
      props.target = "_blank";
      props.rel = "noopener";
    }
  }
}

function links() {
  return transformer;
}

export default links;
