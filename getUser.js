const express = require("express");
const app = express();
const users = require('./users');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const getUser = function(req, res, next) {
  req.user = users.findByID(req.cookies['userID']);
  next();
}

module.exports = getUser;