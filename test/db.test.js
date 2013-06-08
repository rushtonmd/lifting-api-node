'use strict';

var assert = require('assert'),
  db = require('../lib/db'),
  should = require('chai').should();
//supertest = require('supertest'),
//api = supertest('http://localhost:3000');


describe('database', function() {
  var insertedOrder;

  it('open should open database connection', function(done) {
    db.open(done);
  });

  it('should delete a user and not have it returned in a query', function(done) {
    db.insertOne('userprofiles', {
      username: 'testuser',
      password: 'testpassword',
      email: 'testemail@test.com'
    }, function(err, user) {
      should.not.exist(err);
      //console.log(user.username);
      //should.exist(user.username).and.should.eql('testuser');
      should.exist(user);
      user.username.should.eql('testuser');

      db.findAndRemove('userprofiles', {
        username: 'testuser'
      }, function(err, doc) {
        should.not.exist(err);
        //should.exist(doc).and.should.eql(1);
        doc.should.eql(1);
        // Verify that the document is gone
        db.findOne('userprofiles', {
          username: 'testuser'
        }, function(err, user) {
          console.log(user);
          should.not.exist(err);
          should.exist(user);
          user.length.should.eql(0);
          done();
        });
      });
    });
  });

  it('should delete multiple lifts and get back 0 results after', function(done) {
    db.insert('lifts', [{
      username: 'testuser',
      workout: 1
    }, {
      username: 'testuser',
      workout: 2
    }], function(err, lifts) {
      should.not.exist(err);
      //console.log(user.username);
      //should.exist(user.username).and.should.eql('testuser');
      should.exist(lifts);
      lifts.length.should.eql(2);
      done();
      db.findAndRemove('lifts', {
        username: 'testuser'
      }, function(err, doc) {
        should.not.exist(err);
        doc.should.eql(2);

        // Verify that the document is gone
        db.findOne('lifts', {
          username: 'testuser'
        }, function(err, lifts) {
          should.not.exist(err);
          should.exist(lifts);
          lifts.length.should.eql(0);
          done();
        });
      });
    });
  });

  it('open should close database connection', function(done) {
    db.close(done);
  });


  // test('insertOne should insert a transaction', function (done) {
  //   var ord = nocklib.generateRandomOrder(exchangeData);
  //   db.insertOne('transactions', ord, function (err, order) {
  //     should.not.exist(err);
  //     should.exist(order._id);
  //     insertedOrder = order;
  //     done();
  //   });
  // });
  // test('findOne should find a single transaction', function (done) {
  //   var id = insertedOrder._id;
  //   db.findOne('transactions', id, function (err, order) {
  //     should.not.exist(err);
  //     should.exist(order._id);
  //     order.price.should.eql(insertedOrder.price);
  //     order.volume.should.eql(insertedOrder.volume);
  //     done();
  //   });
  // });
  // test('findOne should not find a transaction for an id that does not exist', function (done) {
  //   db.findOne('transactions', {
  //     _id: 0
  //   }, function (err, order) {
  //     should.not.exist(err);
  //     should.not.exist(order);
  //     done();
  //   })
  // });
  // test('findAndRemove should find an item and remove it from the database', function (done) {
  //   var id = insertedOrder._id;
  //   db.findAndRemove('transactions', {
  //     _id: insertedOrder._id
  //   }, function (err, order) {

  //     should.not.exist(err);
  //     order._id.should.eql(id);

  //     db.findOne('transactions', id, function (err, order) {
  //       should.not.exist(err);
  //       should.not.exist(order);
  //       done();
  //     });
  //   });
  // });
});