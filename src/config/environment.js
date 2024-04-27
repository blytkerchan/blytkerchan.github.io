import packageJson from "../../package.json";

const environment = {
  env: process.env.NODE_ENV,
  version: packageJson.version,
  loginEndpoint: "http://localhost:8419/api/v1/authn",
  indexEndpoint: "/_posts/index.json",
  useHashRouting: Object.keys(packageJson.blog).includes("useHashRouting") ? packageJson.blog["useHashRouting"] : false,
};

export default environment;
