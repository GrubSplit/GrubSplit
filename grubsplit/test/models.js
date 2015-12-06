var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mocha_test');
var ObjectID = mongoose.Types.ObjectId;
var db = mongoose.connection;

var User = require('../models/User.js');
var Grub = require('../models/Grub.js');
var SubGrub = require('../models/SubGrub.js');
var assert = require('assert');

before(function (done) {
  // Make sure database is empty before starting tests
  db.on('open', function () {
    User.remove({}, function(err) {
      console.log('User collection removed');
      Grub.remove({}, function(err) {
        console.log('Grub collection removed');
        SubGrub.remove({}, function(err) {
          console.log('SubGrub collection removed');
          done();
        });
      });
    });
  });
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

  beforeEach(function(done){
    // Insert some test Grub data
    done();
  });    
  
  afterEach(function(done){
    // Remove all Grub data
    done();
  });  

  describe('#createNewGrub()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
    });

  });

  describe('#getGrub()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
    });

  }); 

  describe('#updateTax()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
    });

  });

  describe('#updateTip()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
    });

  }); 

  describe('#updateDelivery()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
    });

  });

  describe('#deleteGrub()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
    });

  });

  describe('#completeGrub()', function () {

    it('should return error if grub with given id does not exist', function (done) {
      done();
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