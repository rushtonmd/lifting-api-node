'use strict';

var assert = require('assert'),
  db = require('../lib/db'),
  should = require('chai').should(),
  supertest = require('supertest'),
  api = supertest('http://localhost:3000');


describe('Authentication', function() {
  before(function(done) {
    db.open(done);
  }),
  after(function(done){
    db.close(done);
  }),

  it('errors if wrong basic auth credentials', function(done) {
    api.get('/marco')
      .set('x-api-key', '123myapikey')
      .auth('incorrect', 'credentials')
      .expect(401, done)
  });

  it('success if correct basic auth credentials', function(done) {
    api.get('/marco')
      .set('x-api-key', '123myapikey')
      .auth('correct', 'credentials')
      .expect(200, done)
  });

});

describe('Users', function() {
  before(function(done) {
    db.open(function(err) {
      if (err) return done(err);
      db.findAndRemove('userprofiles', {
        username: 'testuser'
      }, done);
    });
  }),
  after(function(done) {
    // Remove 'testuser'
    db.findAndRemove('userprofiles', {
      username: 'testuser'
    }, function(err, result){
      db.close(done);
    });
  }),

  it('returns an empty array if no user is found', function(done) {
    api.get('/api/users/testuser')
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('users').and.be.instanceof(Array).and.lengthOf(0);
      done();
    });
  });

  it('new signup returns new user as JSON', function(done) {
    api.post('/api/users/new')
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
    api.post('/api/users/new')
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