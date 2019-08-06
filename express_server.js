const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const users = require('./users');
const getUser = require('./getUser');
const urlDatabase = require('./database');

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

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls/new', (req, res) => {
  if (!req.cookies['userID']) {
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
    console.log('templatevars    ' + templateVars);
    console.log('?????    ' + urlDatabase.urlDatabase[req.params.shortURL]);
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