import packageJson from "../../package.json";

const environment = {
  env: process.env.NODE_ENV,
  version: packageJson.version,
  loginEndpoint: "http://localhost:8419/api/v1/authn",
  indexEndpoint: "/_posts/index.json",
  categoriesEndpoint: "/_posts/categories.json",
  useHashRouting: Object.keys(packageJson.blog).includes("useHashRouting") ? packageJson.blog["useHashRouting"] : false,
  title: packageJson.blog.title,
  pageSize: Object.keys(packageJson.blog).includes("pageSize") ? packageJson.blog.pageSize : 50,
  minPostsPerCategory: Object.keys(packageJson.blog).includes("minPostsPerCategory")
    ? packageJson.blog.minPostsPerCategory
    : 5,
  footerText: Object.keys(packageJson.blog).includes("footerText")
    ? packageJson.blog.footerText
    : `Vlinder Software's Phoenix v${packageJson.version}`,
};

export default environment;
