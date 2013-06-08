'use strict';

var express = require('express'),
  path = require('path'),
  http = require('http'),
  //RedisStore = require("connect-redis")(express),
  cookie = require('cookie'),
  bcrypt = require('bcrypt'),
  db = require('./db'),
  ObjectID = require('mongodb').ObjectID,
  sessionStore = db.getSessionStore(express),
  uuid = require('node-uuid'),
  _ = require("underscore");

var encryptPassword = function(plainText, callback) {
  console.log('trying to encrypt ' + plainText);
  bcrypt.hash(plainText, 8, callback);
}

//var sessionStore = new RedisStore(db.sessionStoreCredentials());

module.exports = {
  getSessionStore: function() {
    return sessionStore;
  },
  openDatabase: function(callback) {
    db.open(callback);
    db.openRedis(callback);
  },
  getUser: function(username, callback) {
    db.findOne('userprofiles', {
      username: username
    }, function(err, user) {
      //if (!user) err = new Error("Not a valid user!");
      if (!user || user.length <= 0) user = [];
      else user = [{
          username: user[0].username,
          email: user[0].email,
          liftnames: user[0].liftnames
        }];
      //else user = 
      callback(err, {
        users: user
      });
    });
  },
  getAllLifts: function(username, callback) {
    db.find('lifts', {
      username: username,
      deleted: false
    }, 0, function(err, lifts) {
      callback(err, {
        "lifts": lifts
      });
    });
  },
  getSingleLift: function(username, liftid, callback) {

    // We need to check to see if the liftid is a valid ObjectID
    // This is taken from objectid.js 
    // var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    // if(liftid != null && 'number' != typeof liftid && (liftid.length != 12 && liftid.length != 24) && checkForHexRegExp(liftid))

    // The ObjectID param throws an error if the liftid is invalid
    try {
      var _id = ObjectID(liftid);
    } catch (e) {
      console.log(e);
      //callback('Invalid liftid.')
    }

    //console.log(username);
    db.findOne('lifts', {
      username: username,
      _id: _id,
      deleted: false
    },

    function(err, lifts) {
      if (!lifts) lifts = [];
      callback(err, {
        lifts: lifts
      })
    });
  },
  getAllLiftNames: function(username, callback) {
    // Lift names are an object containing a "musclegroup" value as well as a "liftname" value
    // Get all the global lift names

    db.findOne('globals', null, function(err, globals) {

      var allLifts = [];
      if (globals.length > 0 && globals[0].liftnames) allLifts = globals[0].liftnames;

      // Get all the custom user lift names
      db.findOne('userprofiles', {
        username: username
      }, function(err, userprofile) {

        // Combine the global lift names with the personal lift names
        if (userprofile.length > 0 && userprofile[0].liftnames) allLifts = _.union(allLifts, userprofile[0].liftnames);

        // Pass back the combined list of all liftnames
        callback(err, {
          "liftnames": allLifts
        })
      });
    });
  },
  addNewLiftName: function(username, liftName, muscleGroup, callback) {
    // Get all the custom user lift names
    var newLiftQuery = {
      liftnames: {
        musclegroup: muscleGroup,
        liftname: liftName
      }
    };
    // Check for duplicates
    var dupQuery = {
      username: username,
      liftnames: {
        $elemMatch: {
          musclegroup: muscleGroup,
          liftname: liftName
        }
      }
    };
    console.log("Adding new liftname" + liftName);
    db.findOne('userprofiles', dupQuery, function(err, profile) {
      if (profile.length > 0) {
        callback("Liftname already exists for this user!", null);
      } else {
        db.pushWithUsername('userprofiles', username, newLiftQuery, function(err, liftname) {
          console.log("Added: " + liftname);
          callback(err, liftname);
        });
      }
    });
  },
  deleteLiftName: function(username, liftName, muscleGroup, callback) {
    // Get all the custom user lift names
    var removeLiftQuery = {
      liftnames: {
        musclegroup: muscleGroup,
        liftname: liftName
      }
    };

    db.pullWithUsername('userprofiles', username, removeLiftQuery, callback);
  },

  getAllMuscleGroups: function(username, callback) {
    db.findOne('globals', null, function(err, globals) {
      callback(err, {
        tet: globals
        //"musclegroups": globals.musclegroups
      });
    });
  },
  addNewLift: function(username, lift, callback) {
    console.log(lift);
    var newLift = {
      username: username,
      workout: lift.workout,
      musclegroup: lift.musclegroup,
      liftname: lift.liftname,
      setnumber: lift.setnumber,
      reps: lift.reps,
      weight: lift.weight,
      deleted: false,
      recorddate: module.exports.getDateInMilliseconds(lift.recorddate)
    };
    db.insertOne('lifts', newLift, function(err, lift) {
      callback(err, {
        "lift": lift
      });
    });
  },
  deleteLift: function(username, id, callback) {

    try {
      var _id = ObjectID(id);
    } catch (e) {
      console.log(e);
      callback('Invalid liftid.')
    }

    // Get all the custom user lift names
    var removeLiftQuery = {
      deleted: true
    };

    db.setValue('lifts', username, _id, removeLiftQuery, callback);
  },
  createUser: function(username, email, password, callback) {
    console.log("Creating user " + username);
    encryptPassword(password, function(err, encryptedPassword) {
      var user = {
        username: username,
        email: email,
        password: encryptedPassword
      };

      db.insertOne('userprofiles', user, function(err, user) {
        console.log(user);
        callback(err, user);
      });
    });
  },
  authenticate: function(username, password, callback) {
    db.find('userprofiles', {
      username: username
    }, 1, function(err, user) {
      //callback(err, user._id);
      if (user) {
        bcrypt.compare(password, user.password, function(err, res) {
          if (res === true) callback(err, user._id);
          else callback(err, null);
        });
      } else callback(err, null);
    });
  },
  ensureAuthenticated: function(req, res, next) {
    if (req.session._id) {
      return next();
    }
    res.redirect('/');
  },
  getDateInMilliseconds: function(date) {
    var now = new Date(date);
    return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
  },
  convertMillisecondsToDate: function(milliseconds) {
    var newDate = new Date(0);
    newDate.setUTCMilliseconds(milliseconds);
    return newDate;
  },
  generateNewApiKey: function() {
    return "apikey:" + uuid.v4();
  },
  basicApiAuth: express.basicAuth(function(username, password, callback) {
    //console.log("Got username:password " + username + ":" + password);
    var result = (username === 'swole' && password === 'patrol');
    callback(null /* error */ , result);
  })

}