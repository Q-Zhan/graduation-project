const user = require('./user.js');

module.exports = function routerCollection(app) {
  app.use(user);
}