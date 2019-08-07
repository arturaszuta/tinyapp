const { assert } = require('chai');

const users = require('../users');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = users.findByEmail("user@example.com", users.userData).id;
    const expectedOutput = "userRandomID";
    assert.equal(expectedOutput, user, 'The output is correct!')
  });

  it('should return undefined if user is not in the database', function() {
    const user = users.findByEmail("user4@example.com", users.userData).id;
    const expectedOutput = undefined;
    assert.equal(expectedOutput, user, 'The output is correct!')
  });

});