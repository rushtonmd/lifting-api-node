'use strict';

var assert = require('assert'),
  db = require('../lib/db'),
  liftingLib = require('../lib/lifting-lib'),
  should = require('chai').should(),
  supertest = require('supertest'),
  api = supertest('http://localhost:3000');

describe('Lifts', function() {
  var lift_id = '';
  var liftnamesLength = 0;
  var newlift = {
    username: 'testuser',
    workout: Math.floor(Math.random() * 11),
    musclegroup: 'TESTMUSCLEGROUP',
    liftname: 'TESTLIFTNAME',
    setnumber: Math.floor(Math.random() * 11),
    reps: Math.floor(Math.random() * 11),
    weight: Math.floor(Math.random() * 101),
    recorddate: new Date()
  };
  before(function(done) {
    // Open the database connection and remove all lifts with the username 'testuser'
    db.open(function(err) {
      if (err) return done(err);
      db.findAndRemove('lifts', {
        username: 'testuser'
      }, function(err, doc) {
        if (err) return done(err);
        done();
      });
    });
  }),
  after(function(done) {
    // Remove 'testuser' from lifts collection
    db.findAndRemove('lifts', {
      username: 'testuser'
    }, function(err, doc) {
      db.close(done);
    });
  }),



  it('returns empty array of lifts as JSON for testuser with no lifts', function(done) {
    api.get('/api/users/testuser/lifts')
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('lifts').and.be.instanceof(Array).and.lengthOf(0);
      done();
    });
  }),

  it('returns new lift as JSON after creating new lift for testuser', function(done) {
    api.post('/api/users/testuser/lifts/new')
      .send({
      newLift: {
        username: 'testuser',
        workout: Math.floor(Math.random() * 11),
        musclegroup: 'TESTMUSCLEGROUP',
        liftname: 'TESTLIFTNAME',
        setnumber: Math.floor(Math.random() * 11),
        reps: Math.floor(Math.random() * 11),
        weight: Math.floor(Math.random() * 101),
        recorddate: new Date()
      },
    })
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);

      res.body.should.have.property('lift');

      done();
    });
  });

  it('returns new lift as JSON after creating new lift for testuser and have correct date', function(done) {
    var date = new Date();
    var newLift = {
      username: 'testuser',
      workout: Math.floor(Math.random() * 11),
      musclegroup: 'TESTMUSCLEGROUP',
      liftname: 'TESTLIFTNAME',
      setnumber: Math.floor(Math.random() * 11),
      reps: Math.floor(Math.random() * 11),
      weight: Math.floor(Math.random() * 101),
      recorddate: date
    };

    api.post('/api/users/testuser/lifts/new')
      .send({
      newLift: newLift
    })
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);

      res.body.should.have.property('lift');
      res.body.lift.should.have.property('recorddate');

      var newDate = new Date(0);
      newDate.setUTCMilliseconds(res.body.lift.recorddate);

      newDate.should.eql(date);
      res.body.lift.username.should.eql(newLift.username);
      res.body.lift.workout.should.eql(newLift.workout);
      res.body.lift.musclegroup.should.eql(newLift.musclegroup);
      res.body.lift.liftname.should.eql(newLift.liftname);
      res.body.lift.setnumber.should.eql(newLift.setnumber);
      res.body.lift.reps.should.eql(newLift.reps);
      res.body.lift.weight.should.eql(newLift.weight);

      lift_id = res.body.lift._id;
      done();
    });
  });

  it('getting a single lift gets a lifts object with a single item in the array', function(done) {
    api.get('/api/users/testuser/lifts/' + lift_id)
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('lifts').and.be.instanceof(Array).and.lengthOf(1);
      done();
    });
  });

  it('deleting lift returns a result of 1', function(done) {
    api.del('/api/users/testuser/lifts/' + lift_id)
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.equal(1);
      done();
    });
  });

  it('getting a single delted lift gets nothing', function(done) {
    api.get('/api/users/testuser/lifts/' + lift_id)
      .auth('correct', 'credentials')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('lifts').and.be.instanceof(Array).and.lengthOf(0);
      done();
    });
  });


});