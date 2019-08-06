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
      password: "funk"
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
  },
  findByID(id) {
    for (let entry of this.userData) {
      let objectID = Object.keys(entry);
      if (objectID[0] === id) {
        return entry[objectID];
      }
    }
    return null;
  }
}
console.log(users.findByID('userRandoD'));
module.exports = users;