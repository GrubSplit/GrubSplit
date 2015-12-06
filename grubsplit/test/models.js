var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mocha_test');
var ObjectID = mongoose.Types.ObjectId;
var db = mongoose.connection;

var User = require('../models/User.js');
var Grub = require('../models/Grub.js');
var SubGrub = require('../models/SubGrub.js');
var assert = require('assert');

before(function (done) {
  // Connect to test database and clear it out for testing 
    done();
});

after(function(done) {
  mongoose.connection.close();
  done();
});

// Testing the User model
describe('User', function() {

  beforeEach(function(done){
    // Insert some test User data
    done();
  });    
  
  afterEach(function(done){
    // Remove all User data
    done();
  });  

  describe('#setTokens()', function () {

    it('should return error if User with given id does not exist', function (done) {
      done();
    });

    it('should set token and refresh_token fields for given User if User exists', function (done) {
      done();
    });

  });

  describe('#deleteTokens()', function () {

    it('should return error if User with given id does not exist', function (done) {
      done();
    });

    it('should set token and refresh_token fields to null for given User if User exists', function (done) {
      done();
    });

  });

});

// Testing the Grub model
describe('Grub', function() {

  before(function(done) {
    if (mongoose.connection.db) {
      mongoose.connection.close();
    }
    mongoose.connect('mongodb://localhost/grubsplit_test');
    mongoose.connection.db.dropDatabase();
    done();
  });  
  
  after(function(done){
    mongoose.connection.close();
    done();
  });  

  describe('#createNewGrub()', function () {

    it('should successfully create a grub, indicating that it is an open grub', function (done) {
      var user_id;
      User.create({
        email: "test@test.com",
        name: 'Tester'
      }, function(err, user) {
        user_id = user._id;
        Grub.createNewGrub(user_id, 70706, 'Cafe 472', function(err, grub) {
          assert.equal(err, null);
          assert.equal(grub.time_ordered, null);
          done();
        });
      });
    });

  });

  describe('#getGrub()', function () {
    var tester_id;
    var hungry_id;
    before(function(done){
      User.create({
        email : 'test@test.com', 
        name : 'Tester', 
      }, function(err, user) {
        tester_id = user._id;
        User.create({
          email : 'hungry@ta.com', 
          name : 'Hungry', 
        }, function(err, user) {
          hungry_id = user._id;
          done();
        });
      });
    });    
    
    after(function(done){
      done();
    });

    it('should return the grub, with owner and subgrubs populated, if the given id exists', function (done) {
      var grub_id;
      Grub.createNewGrub(tester_id, 70706, 'Cafe 472', function(err, grub) {
        grub_id = grub._id;
        SubGrub.createNewSubGrub(hungry_id, grub_id, function(err, subgrub) {

          Grub.getGrub(grub_id, function(err, grub) {
            assert.equal(err, null);
            assert.equal(grub.owner.name, 'Tester');
            assert.equal(grub.subGrubs.length, 1);
            assert.equal(grub.subGrubs[0].owner.name, 'Hungry');
            done();
          });
        });
      });
    });

    it('should return error if grub with given id does not exist', function (done) {
      Grub.getGrub('', function(err, grub) {
        assert.equal(grub, null);
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not find grub');
        done();
      });
    });

  }); 

  describe('#deleteGrub()', function () {

    it('should successfully delete a grub (if the grub id exists) and return no errors', function(done) {
      User.create({
        email: 'test@test.com',
        name: 'Tester'
      }, function(err, user) {
        Grub.createNewGrub(user._id, 70706, 'Cafe 472', function(err, grub) {
          assert.equal(err, null);
          assert.notEqual(grub, null);
          
          Grub.deleteGrub(grub._id, function(err) {
            assert.equal(err, null);
            done();
          });
        });
      });      
    });

    it('should return error if grub with given id does not exist', function (done) {
      Grub.deleteGrub('', function(err) {
        assert.notEqual(err, null);
        assert.equal(err, 'could not delete grub');
      });
      done();
    });

  });

  describe('#completeGrub()', function () {
    var grub_id;
    before(function(done) {
      User.create({
        email: 'test@test.com',
        name: 'Tester'
      }, function(err, user) {
        Grub.createNewGrub(user._id, 70706, 'Cafe 472', function(err, grub) {
          grub_id = grub._id;
          console.log(grub)
          done();
        });
      });  
    });

    it('should successfully complete a grub, if the given id exists', function(done) {
      Grub.completeGrub(grub_id, function(err, completed_grub) {
        assert.equal(err, null);
        console.log(completed_grub)
        assert.notEqual(completed_grub.time_ordered, null);
        // TODO: add things for tip, tax, delivery fee
        done();
      }); 
    });

    it('should return error if grub with given id does not exist', function (done) {
      Grub.completeGrub('', function(err, grub) {
        assert.equal(grub, null);
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not mark grub as completed');
        done();
      });
    });

  }); 

});


// Testing the SubGrub model
describe('SubGrub', function() {

  beforeEach(function(done){
    // Insert some test SubGrub data
    done();
  });    
  
  afterEach(function(done){
    // Remove all SubGrub data
    done();
  });  

  describe('#createNewSubGrub()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
    });

  });

  describe('#addItems()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
    });

  }); 

  describe('#getSubGrub()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
    });

  }); 

  describe('#deleteSubGrub()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
    });

  });

  describe('#findUserGrubs()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
    });

  });
});