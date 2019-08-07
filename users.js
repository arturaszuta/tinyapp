const users = {
  userData: [{
    "userRandomID": {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "$2b$10$CZ.MiVuNq5HB.YA54HRaW.P9UNsSau7f1ZE66ShnsR6xrmb.H41l2" //purple
    }},{
   "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "$2b$10$Gb9K7nrlRhasBj6QmqXR2.0TiE.WTO295l/o8ssIoHSIJV5c9vv9u" //funk
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
  findByEmail(email, database) {
    for (let entry of database) {
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
  },

}
console.log(users.findByID('userRandoD'));
module.exports = users;