import env from "../config/environment";

export default function useMeta() {
  var locallink = null;
  const location = window.location;

  if (env.useHashRouting) {
    locallink = location.hash.substring(1);
  } else {
    locallink = location.pathname;
  }
  var filename = `/meta/${locallink.replace(/^[^0-9]+/, "").replace(/\//g, "-")}.json`;

  console.log(filename);

  return {
    fetchMeta: () => {
      return fetch(filename);
    },
  };
}
