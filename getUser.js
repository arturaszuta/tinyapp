const users = require('./users');


const getUser = function(req, res, next) {
  req.user = users.findByID(req.session.userID);
  next();
}

// getUser({session: {userID : 'userRandomID'} }, '',function() {} );
module.exports = getUser;