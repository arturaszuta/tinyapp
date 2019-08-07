const users = require('./users');


const getUser = function(req, res, next) {
  req.user = users.findByID(req.session.userID);
  next();
}


module.exports = getUser;