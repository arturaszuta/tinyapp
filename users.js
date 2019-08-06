const users = {
  userData: [{
    "userRandomID": {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    }},{
   "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    }},
  ],
  all() { return this.userData },
  add(data) {
    const objOut = {};
    objOut[data.id] = {
      id : data.id,
      email : data.email,
      password : data.password
    }
    this.userData.push(objOut);
  },
  findByEmail(email) {
    for (let entry of this.userData) {
      let objectID = Object.keys(entry);
      if (entry[objectID].email === email) {
        return entry[objectID];
      }
    }
    return false;
  }
}
module.exports = users;