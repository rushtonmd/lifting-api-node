'use strict';

var assert = require('assert'),
  db = require('../lib/db'),
  should = require('chai').should(),
  supertest = require('supertest'),
  api = supertest('http://localhost:3000');


describe('database', function() {
  var insertedOrder;

  it('open should open database connection', function(done) {
    db.open(done);
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