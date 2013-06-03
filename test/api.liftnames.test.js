'use strict';

var assert = require('assert'),
  db = require('../lib/db'),
  liftingLib = require('../lib/lifting-lib'),
  should = require('chai').should(),
  supertest = require('supertest'),
  api = supertest('http://localhost:3000');

describe('Liftnames', function() {
  var liftnamesLength = 0;
  before(function(done) {
    // Open the database connection and setup a new user with username 'testuser'
    db.open(function(err){
      if (err) return done(err);
      liftingLib.createUser('testuser', 'test@test.com', 'testpassword', done);
    });
  }),
  after(function(done) {
    // Remove 'testuser'
    db.findAndRemove('userprofiles', {
      username: 'testuser'
    }, done);
  }),

  it('returns all liftnames as JSON for testuser', function(done) {
    api.get('/api/user/testuser/liftnames')
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('liftnames').and.be.instanceof(Array);
      liftnamesLength = res.body.liftnames.length;
      console.log(liftnamesLength);
      done();
    });
  });

  it('adding new liftname returns a result of 1', function(done) {
    api.get('/api/user/testuser/liftnames/new')
      .send({
      muscleGroup: 'TESTMUSCLEGROUP',
      newLiftName: 'TESTLIFTNAME'
    })
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.equal(1);
      liftnamesLength = liftnamesLength + 1;
      done();
    });
  });

  it('return 1 additional liftname after adding a new liftname', function(done) {
    api.get('/api/user/testuser/liftnames')
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('liftnames').and.be.instanceof(Array).and.lengthOf(liftnamesLength);
      done();
    });
  });

  it('deleting liftname returns a result of 1', function(done) {
    api.get('/api/user/testuser/liftnames/delete')
      .send({
      muscleGroup: 'TESTMUSCLEGROUP',
      liftName: 'TESTLIFTNAME'
    })
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.equal(1);
      liftnamesLength = liftnamesLength - 1;
      done();
    });
  });

  it('returns 1 less liftname after deleting a liftname', function(done) {
    api.get('/api/user/testuser/liftnames')
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('liftnames').and.be.instanceof(Array).and.lengthOf(liftnamesLength);
      done();
    });
  });

  it('deleting liftname that does not exist returns a result of 1', function(done) {
    api.get('/api/user/testuser/liftnames/delete')
      .send({
      muscleGroup: 'TESTMUSCLEGROUP',
      liftName: 'TESTLIFTNAME'
    })
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.equal(1);
      done();
    });
  });

  it('returns same number of liftnames after trying to delete a liftname that is not in the list ', function(done) {
    api.get('/api/user/testuser/liftnames')
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('liftnames').and.be.instanceof(Array).and.lengthOf(liftnamesLength);
      done();
    });
  });

});