import packageJson from "../../package.json";

const environment = {
  env: process.env.NODE_ENV,
  version: packageJson.version,
};

export default environment;
