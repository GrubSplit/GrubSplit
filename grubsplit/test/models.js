var mongoose = require('mongoose');
var ObjectID = mongoose.Types.ObjectId;
var db = mongoose.connection;

var User = require('../models/User.js');
var Grub = require('../models/Grub.js');
var SubGrub = require('../models/SubGrub.js');
var assert = require('assert');

before(function(done) {
  // console.log('1');
  // console.log(mongoose.connection.db.databaseName);
  // if (mongoose.connection.db.databaseName) {
  //   console.log('2');
  // mongoose.connection.close();
  //   mongoose.disconnect();
  //   console.log(mongoose.connection.db.databaseName);
  //   mongoose.connect('mongodb://localhost/grubsplit_test');
  // }
  // mongoose.connection.db.dropDatabase();
  // Connect to test database and clear it out for testing
  if (mongoose.connection.db) return done();
  mongoose.createConnection('mongodb://localhost/grubsplit_test', done);
});

after(function(done) {
  mongoose.connection.close();
  done();
});

// Testing the User model
describe('User', function() {

  before(function(done) {
    // if (mongoose.connection.db) {
    //   mongoose.connection.close();
    //   mongoose.createConnection('mongodb://localhost/grubsplit_test', done);
    // }
    if (mongoose.connection.db) return done();
    mongoose.connect('mongodb://localhost/grubsplit_test', done);
    // mongoose.connection.db.dropDatabase();
    // console.log(mongoose.connection.db)
    // done();
    // return done();
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });

  describe('#setTokens()', function() {
    var user_id;
    before(function(done) {
      User.create({
        email: "test@test.com",
        name: 'Tester'
      }, function(err, user) {
        console.log(user);
        user_id = user._id;
        done();
      });
    });

    it('should return error if User with given id does not exist', function(done) {
      User.setTokens('', '', '', function(err, user) {
        assert.equal(user, null);
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not set tokens');
        done();
      });
    });

    it('should set token and refresh_token fields for given User if User exists', function(done) {
      User.setTokens(user_id, 'access', 'refresh', function(err, user) {
        console.log(user);
        assert.equal(err, null);
        assert.equal(user.token, 'access');
        assert.equal(user.refresh_token, 'refresh');
        done();
      });
    });

  });

  describe('#deleteTokens()', function() {

    it('should return error if User with given id does not exist', function(done) {
      User.setTokens('', function(err) {
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not delete tokens');
        done();
      });
    });

    it('should set token and refresh_token fields to null for given User if User exists', function(done) {
      done();
    });

  });

});

// Testing the Grub model
describe('Grub', function() {

  before(function(done) {
    if (mongoose.connection.db) {
      mongoose.connection.close();
      mongoose.connect('mongodb://localhost/grubsplit_test', done);
    }
    mongoose.connection.db.dropDatabase();
    done();
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });

  describe('#createNewGrub()', function() {

    it('should successfully create a grub, indicating that it is an open grub', function(done) {
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

  describe('#getGrub()', function() {
    var tester_id;
    var hungry_id;

    before(function(done) {
      User.create({
        email: 'test@test.com',
        name: 'Tester',
      }, function(err, user) {
        tester_id = user._id;
        User.create({
          email: 'hungry@ta.com',
          name: 'Hungry',
        }, function(err, user) {
          hungry_id = user._id;
          done();
        });
      });
    });

    it('should return the grub, with owner and subgrubs populated, if the given id exists', function(done) {
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

    it('should return error if grub with given id does not exist', function(done) {
      Grub.getGrub('', function(err, grub) {
        assert.equal(grub, null);
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not find grub');
        done();
      });
    });

  });

  describe('#deleteGrub()', function() {

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

    it('should return error if grub with given id does not exist', function(done) {
      Grub.deleteGrub('', function(err) {
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not delete grub');
        done();
      });
    });

  });

  describe('#completeGrub()', function() {
    var grub_id;
    before(function(done) {
      User.create({
        email: 'test@test.com',
        name: 'Tester'
      }, function(err, user) {
        Grub.createNewGrub(user._id, 70706, 'Cafe 472', function(err, grub) {
          grub_id = grub._id;
          done();
        });
      });
    });

    it('should successfully complete a grub, if the given id exists', function(done) {
      Grub.completeGrub(grub_id, 10, 0.25, 2, 3.25, 0, 15.50, function(err, grub) {
        assert.equal(err, null);
        assert.notEqual(grub.time_ordered, null);
        assert.equal(grub.subtotal, 10);
        assert.equal(grub.tax, 0.25);
        assert.equal(grub.tip, 2);
        assert.equal(grub.delivery_fee, 3.25);
        assert.equal(grub.discount, 0);
        assert.equal(grub.total, 15.50);
        done();
      });
    });

    it('should return error if grub with given id does not exist', function(done) {
      Grub.completeGrub('', 0, 0, 0, 0, 0, 0, function(err, grub) {
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
  var tester_id;
  var hungry_id;
  var grub_id;

  before(function(done) {
    if (mongoose.connection.db) {
      mongoose.connection.close();
      mongoose.connect('mongodb://localhost/grubsplit_test');
    }
    mongoose.connection.db.dropDatabase();

    User.create({
      email: 'test@test.com',
      name: 'Tester'
    }, function(err, user) {
      tester_id = user._id
      User.create({
        email: 'hungry@ta.com',
        name: 'Hungry'
      }, function(err, user) {
        hungry_id = user._id;
        Grub.createNewGrub(tester_id, 70706, 'Cafe 472', function(err, grub) {
          grub_id = grub._id;
          done();
        });
      });
    });
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });

  describe('#createNewSubGrub()', function() {

    it('should successfully create a new (paid) subgrub, given a grub ID and a user ID', function(done) {
      SubGrub.createNewSubGrub(tester_id, grub_id, function(err, subGrub) {
        assert.equal(err, null);
        assert.equal(subGrub.owner, tester_id);
        assert.equal(subGrub.grubID, grub_id);
        assert.equal(subGrub.paid, true);

        Grub.getGrub(grub_id, function(err, grub) {
          assert(grub.subGrubs[0]._id.equals(subGrub._id));
          done();
        });
      });
    });

    it('should successfully create a new (unpaid) subgrub, given a grub ID and a user ID', function(done) {
      SubGrub.createNewSubGrub(hungry_id, grub_id, function(err, subGrub) {
        assert.equal(err, null);
        assert.equal(subGrub.owner, hungry_id);
        assert.equal(subGrub.grubID, grub_id);
        assert.equal(subGrub.paid, false);

        Grub.getGrub(grub_id, function(err, grub) {
          assert(grub.subGrubs[0]._id.equals(subGrub._id) || grub.subGrubs[1]._id.equals(subGrub._id));
          done();
        });
      });
    });

    it('should return error if grub with given id does not exist', function(done) {
      SubGrub.createNewSubGrub(tester_id, '', function(err, subGrub) {
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not find Grub');
        done();
      });
    });

  });

  describe('#addItems()', function() {
    var subgrub_id;
    before(function(done) {
      SubGrub.remove({}, function(err) {
        Grub.findOneAndUpdate({
          _id: grub_id
        }, {
          $set: {
            subGrubs: []
          }
        }, {
          new: true
        }, function(err, grub) {
          SubGrub.createNewSubGrub(tester_id, grub_id, function(err, subGrub) {
            subgrub_id = subGrub._id;
            done();
          });
        });
      });
    });

    it('should successfully add items to a subgrub, given a valid subgrub id', function(done) {
      SubGrub.addItems(subgrub_id, [], 10, function(err, subGrub) {
        assert.equal(err, null);
        assert.equal(subGrub.totalAmount, 10);
        assert.notEqual(subGrub.items, null);
        assert.equal(subGrub.items.length, 0);
        done();
      });
    });

    it('should return error if subgrub with given id does not exist', function(done) {
      SubGrub.addItems('', [], 0, function(err, subGrub) {
        assert.equal(subGrub, null);
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not update subgrub with given items');
        done();
      });
    });

  });

  describe('#getSubGrub()', function() {
    var subgrub_id;
    before(function(done) {
      SubGrub.remove({}, function(err) {
        Grub.findOneAndUpdate({
          _id: grub_id
        }, {
          $set: {
            subGrubs: []
          }
        }, {
          new: true
        }, function(err, grub) {
          SubGrub.createNewSubGrub(tester_id, grub_id, function(err, subGrub) {
            subgrub_id = subGrub._id;
            done();
          });
        });
      });
    });

    it('should return populated subgrub, given a valid subgrub id', function(done) {
      SubGrub.getSubGrub(subgrub_id, function(err, subgrub) {
        assert.equal(err, null);
        assert(subgrub.owner._id.equals(tester_id));
        assert(subgrub.grubID._id.equals(grub_id));
        done();
      });
    });

    it('should return error if subgrub with given id does not exist', function(done) {
      SubGrub.getSubGrub('', function(err, subgrub) {
        assert.equal(subgrub, null);
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not find subGrub');
        done();
      });
    });

  });

  describe('#deleteSubGrub()', function() {
    var subgrub_id;
    before(function(done) {
      SubGrub.remove({}, function(err) {
        Grub.findOneAndUpdate({
          _id: grub_id
        }, {
          $set: {
            subGrubs: []
          }
        }, {
          new: true
        }, function(err, grub) {
          SubGrub.createNewSubGrub(tester_id, grub_id, function(err, subGrub) {
            subgrub_id = subGrub._id;
            done();
          });
        });
      });
    });

    it('should remove subgrub and reference in grub', function(done) {
      SubGrub.deleteSubGrub(subgrub_id, grub_id, function(err) {
        assert.equal(err, null);
        Grub.getGrub(grub_id, function(err, grub) {
          assert.equal(grub_id.subGrubs, null);
          done();
        });
      });
    });


    it('should return error if subgrub with given id does not exist', function(done) {
      SubGrub.deleteSubGrub('', '', function(err) {
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not delete subgrub');
        done();
      });
    });

  });

  describe('#togglePayment()', function() {
    var subgrub_id;
    before(function(done) {
      SubGrub.remove({}, function(err) {
        Grub.findOneAndUpdate({
          _id: grub_id
        }, {
          $set: {
            subGrubs: []
          }
        }, {
          new: true
        }, function(err, grub) {
          SubGrub.createNewSubGrub(tester_id, grub_id, function(err, subGrub) {
            subgrub_id = subGrub._id;
            done();
          });
        });
      });
    });

    it('should change payment status, given a valid subgrub id', function(done) {
      SubGrub.findOne(subgrub_id, function(err, subgrub) {
        assert.equal(subgrub.paid, true);
        SubGrub.togglePayment(subgrub_id, false, function(err, subgrub) {
          assert.equal(err, null);
          assert.equal(subgrub.paid, false);
          done();
        });
      });
    });

    it('should return error if subgrub with given id does not exist', function(done) {
      SubGrub.togglePayment('', false, function(err, subgrub) {
        assert.equal(subgrub, null);
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not update subGrub');
        done();
      });
    });

  });

  describe('#findUserGrubs()', function() {
    var subgrub_id;
    var hungry_grub_id;
    before(function(done) {
      // we create two subgrubs for tester - putting one of them in a different grub that is completed
      SubGrub.remove({}, function(err) {
        Grub.findOneAndUpdate({
          _id: grub_id
        }, {
          $set: {
            subGrubs: []
          }
        }, {
          new: true
        }, function(err, grub) {
          SubGrub.createNewSubGrub(tester_id, grub_id, function(err, subGrub) {
            subgrub_id = subGrub._id;
            Grub.createNewGrub(hungry_id, 70706, 'Cafe 472', function(err, grub) {
              hungry_grub_id = grub._id;
              SubGrub.createNewSubGrub(tester_id, hungry_grub_id, function(err, subGrub) {
                Grub.completeGrub(hungry_grub_id, 10, 0, 0, 0, 0, 10, function(err, grub) {
                  done();
                });
              });
            });
          });
        });
      });
    });

    it('should find all grubs the user has participated in, given a valid user id', function(done) {
      SubGrub.findUserGrubs(tester_id, function(err, open_grubs, past_grubs) {
        assert.equal(err, null);
        assert.equal(open_grubs.length, 1);
        assert(open_grubs[0]._id.equals(grub_id));
        assert.equal(past_grubs.length, 1);
        assert(past_grubs[0]._id.equals(hungry_grub_id));
        done();
      });
    });

    it('should return error if user with given id does not exist', function(done) {
      SubGrub.findUserGrubs('', function(err, open_grubs, past_grubs) {
        assert.equal(open_grubs, null);
        assert.equal(past_grubs, null);
        assert.notEqual(err, null);
        assert.equal(err.msg, 'could not find grubs for user');
        done();
      });
    });

  });
});