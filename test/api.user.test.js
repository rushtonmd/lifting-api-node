'use strict';

var assert = require('assert'),
  db = require('../lib/db'),
  should = require('chai').should(),
  supertest = require('supertest'),
  api = supertest('http://localhost:3000');


describe('Authentication', function() {

  it('errors if wrong basic auth credentials', function(done) {
    api.get('/api/user/:username')
      .set('x-api-key', '123myapikey')
      .auth('incorrect', 'credentials')
      .expect(401, done)
  });

  it('errors if wrong basic auth credentials', function(done) {
    api.get('/api/user/:username')
      .set('x-api-key', '123myapikey')
      .auth('correct', 'credentials')
      .expect(200, done)
  });

});

describe('User', function() {
  before(function(done) {
    // Open the database connection
    db.open(done);
  }),
  after(function(done) {
    // Remove 'testuser'
    db.findAndRemove('userprofiles', {
      username: 'testuser'
    }, done);
  }),

  it('new signup returns new user as JSON', function(done) {
    api.get('/api/user/new')
      .send({
      username: 'testuser',
      password: 'testpassword'
    })
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('username').and.equal('testuser')
      done();
    });
  });

  it('new signup for duplicate returns an error', function(done) {
    api.get('/api/user/new')
      .send({
      username: 'testuser',
      password: 'testpassword'
    })
      .auth('correct', 'credentials')
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('error').and.equal('Username already exists!')
      done();
    });
  });


});