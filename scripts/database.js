const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW", createdAt: 'Wednesday, August 7th 2019, 2:37:30 pm', visits: 1 },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID", createdAt: 'Wednesday, August 7th 2019, 2:37:30 pm', visits: 2 },
  i3BoG3: { longURL: "https://www.google.ca", userID: "abc1234", createdAt: 'Wednesday, August 7th 2019, 2:37:30 pm', visits: 0 }
};

//Helper function which returns URL's belonging to a USER
const filterDatabaseByOwner = function(ID) {
  let answerOBJ = {};
  for (let entry in urlDatabase) {
    if (urlDatabase[entry].userID === ID) {
      answerOBJ[entry] = {longURL: urlDatabase[entry].longURL, userID : urlDatabase[entry].userID, createdAt: urlDatabase[entry].createdAt, visits: urlDatabase[entry].visits };
    }
  }
  if (Object.keys(answerOBJ).length === 0 && answerOBJ.constructor === Object) {
    return null;
  } else {
    return answerOBJ;
  }
};

module.exports = {
  urlDatabase,
  filterDatabaseByOwner
};