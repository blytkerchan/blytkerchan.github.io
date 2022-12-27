function mountRoutes({app, config}) {
  config.apis.forEach((a) => {
    app.use(a.path, a.router);
  });
}

module.exports = mountRoutes;
