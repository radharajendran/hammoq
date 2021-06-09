const userRoutes = require('./users');

const router = (app) => {
  app.use(userRoutes);
};

module.exports = router;