const user = require('./user.js');
const friend = require('./friend.js');
const chat = require('./chat.js');

module.exports = function routerCollection(app) {
  app.use(user);
  app.use(friend);
  app.use(chat)
}