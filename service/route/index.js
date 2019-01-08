const user = require('./user.js');
const friend = require('./friend.js');

module.exports = function routerCollection(app) {
  app.use(user);
  app.use(friend);
}