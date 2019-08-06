const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const users = require('./users');
const getUser = require('./getUser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(getUser);



const generateRandomString = function() {
  const alphaNum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += alphaNum[Math.floor(Math.random() * alphaNum.length)];
  }
  return randomString;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new', {user: req.user});
});

app.get('/urls', (req, res) => {
  let templateVars = {
    urls : urlDatabase,
    user: req.user };
  res.render('urls_index', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    shortURL : req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.user };
  res.render('urls_show', templateVars);
});

app.post('/urls/:shortURL', (req, res) => {
  const newURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = newURL;
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  const tempShortURL = generateRandomString();
  urlDatabase[tempShortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect('/urls/' + tempShortURL);
  // res.send("Ok");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/login', (req, res) => {
  const templateVars = { user : req.user }
  res.render('urls_login', templateVars);
})

app.post('/login', (req, res) => {
  if (!(req.body.email === users.findByEmail(req.body.email).email)) {
    res.status(403).send('Status Code : 403. Email not found.');
  } else if (req.body.password !== users.findByEmail(req.body.email).password) {
    res.status(403).send('Status Code : 403. Password incorrect found.');
  } else {
    const loggedInUser = users.findByEmail(req.body.email);
    res.cookie('userID', loggedInUser.id);
    res.redirect('/urls');
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('userID');
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  let templateVars = { user: req.user };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  const newID = generateRandomString();
  let templateVars = { id : newID, email : req.body.email, password : req.body.password };

  if (!templateVars.email || !templateVars.password) {
    res.status(400).send('You need to provide an email and password!');
  } else if (users.findByEmail(templateVars.email).email === templateVars.email) {
    res.status(400).send('Email already exists!');
  } else {
    users.add(templateVars);
    res.cookie('userID', newID);
    res.redirect('/urls');
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});