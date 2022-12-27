import packageJson from "../../package.json";

const environment = {
  env: process.env.NODE_ENV,
  version: packageJson.version,
  loginEndpoint: "http://localhost:8419/api/v1/login"
};

export default environment;
