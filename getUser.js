const users = require('./users');

//Custom middleware - which checks if the user is logged in, and if it is - makes logged in user object accessible in every single route

const getUser = function(req, res, next) {
  req.user = users.findByID(req.session.userID);
  next();
}


module.exports = getUser;