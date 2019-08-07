const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const users = require('./users');
const getUser = require('./getUser');
const urlDatabase = require('./database');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  secret: 'pleaseNOMORE'
}));
app.use(getUser);



const generateRandomString = function() {
  const alphaNum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += alphaNum[Math.floor(Math.random() * alphaNum.length)];
  }
  return randomString;
};

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls/new', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/urls')
  } else {
    res.render('urls_new', {user: req.user});
  }
});

app.get('/urls', (req, res) => {
  let data = {};
  if (req.user) {
    data = urlDatabase.filterDatabaseByOwner(req.user.id);
  }

  let templateVars = {
    urls : data,
    user: req.user };
  res.render('urls_index', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.user && urlDatabase.filterDatabaseByOwner(req.user.id)[req.params.shortURL].userID === req.user.id) {
    delete urlDatabase.urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(403).send('Status Code : 403. You cannot delete someone elses URL.');
  }
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    shortURL : req.params.shortURL,
    longURL: urlDatabase.urlDatabase[req.params.shortURL].longURL,
    createdBy : urlDatabase.urlDatabase[req.params.shortURL].userID,
    user: req.user };
  res.render('urls_show', templateVars);
});

app.post('/urls/:shortURL', (req, res) => {
  const newURL = req.body.longURL;
  if (req.user && urlDatabase.filterDatabaseByOwner(req.user.id)[req.params.shortURL].userID === req.user.id) {
    urlDatabase.urlDatabase[req.params.shortURL].longURL = newURL;
    res.redirect('/urls');
  } else {
    res.status(403).send('Status Code : 403. You cannot modify someone elses URL.');
  }
 
});

app.post("/urls", (req, res) => {
  const tempShortURL = generateRandomString();
  urlDatabase.urlDatabase[tempShortURL] = { longURL : req.body.longURL, userID : req.user.id };
  res.redirect('/urls/' + tempShortURL);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase.urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get('/login', (req, res) => {
  const templateVars = { user : req.user }
  res.render('urls_login', templateVars);
})

app.post('/login', (req, res) => {
  if (!(req.body.email === users.findByEmail(req.body.email, users.userData).email)) {
    res.status(403).send('Status Code : 403. Email not found.');
  } else if (!bcrypt.compareSync(req.body.password, users.findByEmail(req.body.email, users.userData).password)) {
    res.status(403).send('Status Code : 403. Password incorrect.');
  } else {
    req.session.userID = users.findByEmail(req.body.email, users.userData).id;
    res.redirect('/urls');
  }
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  let templateVars = { user: req.user };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  const newID = generateRandomString();
  let templateVars = { 
    id : newID,
    email : req.body.email,
    password : bcrypt.hashSync(req.body.password, 10)
  };

  if (!templateVars.email || !templateVars.password) {
    res.status(400).send('You need to provide an email and password!');
  } else if (users.findByEmail(templateVars.email, users.userData).email === templateVars.email) {
    res.status(400).send('Email already exists!');
  } else {
    users.add(templateVars);
    req.session.userID = templateVars.id;
    res.redirect('/urls');
  }
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});