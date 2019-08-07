const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" },
  i3BoG3: { longURL: "https://www.google.ca", userID: "abc1234" }
};

//Helper function which returns URL's belonging to a USER
const filterDatabaseByOwner = function(ID) {
  let answerOBJ = {};
  for (let entry in urlDatabase) {
    if (urlDatabase[entry].userID === ID) {
      answerOBJ[entry] = {longURL: urlDatabase[entry].longURL, userID : urlDatabase[entry].userID }
    }
  }
  if (Object.keys(answerOBJ).length === 0 && answerOBJ.constructor === Object) {
    return null;
  } else {
    return answerOBJ;
  }
}

module.exports = {
  urlDatabase,
  filterDatabaseByOwner
}