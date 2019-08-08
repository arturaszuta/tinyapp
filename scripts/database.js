
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW", createdAt: 'Wednesday, August 7th 2019, 2:37:30 pm', visits: 1, uniqueRegisteredVisitors: ['fSDf34'], visitTracker: [{visitorID: '4HG64jh' ,timeOfVisit: 'Wednesday, August 7th 2019, 2:37:30 pm'}] },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID", createdAt: 'Wednesday, August 7th 2019, 2:37:30 pm', visits: 2, uniqueRegisteredVisitors: ['fdhgs53', 'fdg45'], visitTracker: [{visitorID: '4Hg44jh' ,timeOfVisit: 'Tuesday, August 6th 2019, 1:13:30 pm'}, {visitorID: 'hdfgjk5' ,timeOfVisit: 'Tuesday, August 6th 2019, 5:47:12 pm'}] },
  i3BoG3: { longURL: "https://www.google.ca", userID: "abc1234", createdAt: 'Wednesday, August 7th 2019, 2:37:30 pm', visits: 0, uniqueRegisteredVisitors: ['uwey43', 'dfh54A', 'fgg56'], visitTracker: [{visitorID: '543G64jh' ,timeOfVisit: 'Monday, August 5th 2019, 12:55:37 pm'}] }
};

//Helper function which returns URL's belonging to a USER
const filterDatabaseByOwner = function(ID) {
  let answerOBJ = {};
  for (let entry in urlDatabase) {
    if (urlDatabase[entry].userID === ID) {
      answerOBJ[entry] = {
        longURL: urlDatabase[entry].longURL,
        userID : urlDatabase[entry].userID,
        createdAt: urlDatabase[entry].createdAt,
        visits: urlDatabase[entry].visits,
        uniqueRegisteredVisitors: urlDatabase[entry].uniqueRegisteredVisitors,
        visitTracker: urlDatabase[entry].visitTracker,
      };
    }
  }
  if (Object.keys(answerOBJ).length === 0 && answerOBJ.constructor === Object) {
    return null;
  } else {
    return answerOBJ;
  }
};

const updateVisits = function(shortURL, visitorID, time) {
  urlDatabase[shortURL].visitTracker.push({
    visitorID: visitorID,
    timeOfVisit: time
  });
};

const isUniqueVisitor = function(shortURL, userID) {
  if (urlDatabase[shortURL].uniqueRegisteredVisitors.includes(userID)) {
    return false;
  } else {
    return true;
  }
};

module.exports = {
  urlDatabase,
  filterDatabaseByOwner,
  isUniqueVisitor,
  updateVisits
};