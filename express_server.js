const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const moment = require('moment');
const methodOverride = require('method-override');

const users = require('./scripts/users');
const getUser = require('./scripts/getUser');
const url = require('./scripts/database');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  secret: 'pleaseNOMORE'
}));
app.use(methodOverride('_method'));
app.use(getUser);

app.set('view engine', 'ejs');

//Function which generates 6 digit random strings to be used for user ID's and URL's
const generateRandomString = function(chars) {
  const alphaNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let randomString = '';
  for (let i = 0; i < chars; i++) {
    randomString += alphaNum[Math.floor(Math.random() * alphaNum.length)];
  }
  return randomString;
};

//All the routes below :

//"Root route" - either routes to login page if you're not logged in or to main list or URL's if you're
app.get("/", (req, res) => {
  if (req.user) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

//Display fomr to create new URL
app.get('/urls/new', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
  } else {
    res.render('urls_new', {user: req.user});
  }
});

//Show all URL's belonging to signed in user or display message that you need to be logged in
app.get('/urls', (req, res) => {
  let data = {};
  if (req.user) {
    data = url.filterDatabaseByOwner(req.user.id);
  }

  let templateVars = {
    urls : data,
    user: req.user };
  res.render('urls_index', templateVars);
});


//Delete short URL route - which checks whether the user is logged in and they own the particular URL
app.delete('/urls/:shortURL', (req, res) => {
  if (req.user && url.filterDatabaseByOwner(req.user.id)[req.params.shortURL].userID === req.user.id) {
    delete url.urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    let errorMessage = encodeURIComponent("You cannot delete someone elses URL.");
    res.status(403).redirect('/error?message=' + errorMessage);
  }
});


//Show individual URL - where you're a ble to edit the page which the URL points to, also checks whether the user is logged in an owns the particular URL
app.get('/urls/:shortURL', (req, res) => {
  if (url.urlDatabase[req.params.shortURL] === undefined) {
    let errorMessage = encodeURIComponent("Can't find this tiny URL.");
    res.redirect('/error?message=' + errorMessage);
  } else {
    let templateVars = {
      shortURL : req.params.shortURL,
      longURL: url.urlDatabase[req.params.shortURL].longURL,
      createdBy : url.urlDatabase[req.params.shortURL].userID,
      createdAt: url.urlDatabase[req.params.shortURL].createdAt,
      visits: url.urlDatabase[req.params.shortURL].visits,
      uniqueRegisteredVisitors: url.urlDatabase[req.params.shortURL].uniqueRegisteredVisitors,
      visitTracker: url.urlDatabase[req.params.shortURL].visitTracker,
      user: req.user };
    res.render('urls_show', templateVars);
  }
});

//Post route for updating the URL - checks whether the user is logged in and owns the URL
app.put('/urls/:shortURL', (req, res) => {
  const newURL = req.body.longURL;
  if (req.user && url.filterDatabaseByOwner(req.user.id)[req.params.shortURL].userID === req.user.id) {
    url.urlDatabase[req.params.shortURL].longURL = newURL;
    res.redirect('/urls');
  } else {
    let errorMessage = encodeURIComponent("You cannot modify someone elses URL.");
    res.status(403).redirect('/error?message=' + errorMessage);
  }
});

//Post route to create new URL's - checks whether the user is logged in
app.post("/urls", (req, res) => {
  if (req.user && req.body.longURL !== '') {
    const tempShortURL = generateRandomString(6);
    url.urlDatabase[tempShortURL] = { longURL : req.body.longURL, userID : req.user.id, createdAt: moment().subtract(4, 'hours').format("dddd, MMMM Do YYYY, h:mm:ss a"), visits: 0, uniqueRegisteredVisitors: [], visitTracker: [] };
    res.redirect('/urls/' + tempShortURL);
  } else {
    let errorMessage = encodeURIComponent("You need to be logged in and  provide a link to create new URL's");
    res.redirect('/error?message=' + errorMessage);
  }
});

//Route which reroutes the short URL to intended destination, checks whether the short URL is existing in the database
app.get("/u/:shortURL", (req, res) => {
  if (url.urlDatabase[req.params.shortURL] === undefined) {
    let errorMessage = encodeURIComponent("This URL does not exist.");
    res.redirect('/error?message=' + errorMessage);
  } else {
    const timeNow = moment().subtract(4, 'hours').format("dddd, MMMM Do YYYY, h:mm:ss a");
    const longURL = url.urlDatabase[req.params.shortURL].longURL;
    const ID = req.session.userID;
    url.updateVisits(req.params.shortURL, generateRandomString(8), timeNow);
    if (url.isUniqueVisitor(req.params.shortURL, ID)) {
      url.urlDatabase[req.params.shortURL].uniqueRegisteredVisitors.push(ID);
    }
    url.urlDatabase[req.params.shortURL].visits ++;
    res.redirect(longURL);
  }
});

//Route to show login form, if the user is already logged in redirect to the main URL page
app.get('/login', (req, res) => {
  if (req.user) {
    res.redirect('/urls');
  } else {
    const templateVars = { user : req.user };
    res.render('urls_login', templateVars);
  }
});

//Post route to login - which checks whether the user password and email are not blank, and whether the email and password match
app.post('/login', (req, res) => {
  if (!(req.body.email === users.findByEmail(req.body.email, users.userData).email)) {
    let errorMessage = encodeURIComponent("Email not found.");
    res.status(403).redirect('/error?message=' + errorMessage);
  } else if (!bcrypt.compareSync(req.body.password, users.findByEmail(req.body.email, users.userData).password)) {
    let errorMessage = encodeURIComponent("Password is incorrect");
    res.status(403).redirect('/error?message=' + errorMessage);
  } else {
    req.session.userID = users.findByEmail(req.body.email, users.userData).id;
    res.redirect('/urls');
  }
});

//Logout and redirect
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//Route to render registration form, is user is already logged in - redirect to main URL's
app.get('/register', (req, res) => {
  if (req.user) {
    res.redirect('/urls');
  } else {
    let templateVars = { user: req.user };
    res.render('urls_register', templateVars);
  }
});

//Post route for register form - checks whether the email is unique and password is provided
app.post('/register', (req, res) => {
  const newID = generateRandomString(7);
  let templateVars = {
    id : newID,
    email : req.body.email,
    password : bcrypt.hashSync(req.body.password, 10)
  };

  if (!templateVars.email || req.body.password === '') {
    let errorMessage = encodeURIComponent("You need to provide email and password.");
    res.status(400).redirect('/error?message=' + errorMessage);
  } else if (users.findByEmail(templateVars.email, users.userData).email === templateVars.email) {
    let errorMessage = encodeURIComponent("Email already exists.");
    res.status(400).redirect('/error?message=' + errorMessage);
  } else {
    users.add(templateVars);
    req.session.userID = templateVars.id;
    res.redirect('/urls');
  }
});

//Generic error page - which shows error message passed from other routes.
app.get('/error', (req, res) => {
  let error = req.query.message;
  res.render('error_page', { errorMessage: error, user: req.user });
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});