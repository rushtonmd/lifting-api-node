(function() {
  var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    redis = require("redis");

  /* Schemas
  Lifts = {
    username: username,
    workout: Workout Number,
    musclegroup: Muscle Group,
    liftname: Lift Name,
    setnumber: Set Number,
    reps: # of Reps,
    weight: Weight,
    recorddate: Date of Lift
  }
  
  userprofiles = {
    username: username, 
    email: Email Address, 
    displayname: User Display Name, 
    password: password,
    liftnames: [{musclegroup: 'CHEST', liftname: 'FLAT BENCH PRESS'}, {musclegroup: 'ARMS', liftname: 'DUMBELL ARM CURLS'}, 'etc']
  }

  globals = {
    musclegroups: ['CHEST', 'BACK', 'SHOULDERS', 'LEGS', 'ARMS', 'ABS'],
    liftnames: [
      {musclegroup: 'CHEST', liftname: 'FLAT BENCH PRESS'}, 
      {musclegroup: 'CHEST', liftname: 'DUMBELL FLYS'}, 
      {musclegroup: 'BACK', liftname: 'SEATED CABLE ROWS'}, 
      {musclegroup: 'BACK', liftname: 'LAT PULLDOWNS'}, 
      {musclegroup: 'ARMS', liftname: 'DUMBELL ARM CURLS'}, 
      {musclegroup: 'ARMS', liftname: 'CABLE PUSH DOWNS'}] 

  }

*/

  var db = {};
  var currentEnv = process.env['NODE_ENV'].toUpperCase();

  var envMongoHost = process.env['MONGO_HOST_' + currentEnv];
  var envMongoUser = process.env['MONGO_USER_' + currentEnv];
  var envMongoPassword = process.env['MONGO_PASSWORD_' + currentEnv];
  var envMongoDbName = process.env['MONGO_DBNAME_' + currentEnv];
  var envRedisHost = process.env['REDIS_HOST_' + currentEnv];
  var envRedisPort = process.env['REDIS_PORT_' + currentEnv];
  var envRedisPassword = process.env['REDIS_PASSWORD_' + currentEnv];


  var mongoUrl = 'mongodb://' + envMongoUser + ':' + envMongoPassword + envMongoHost + envMongoDbName;
  var sessionStoreCredentials = {
    host: envRedisHost,
    port: envRedisPort,
    pass: envRedisPassword
  };
  //console.log(mongoUrl);

  var prettifyMongodbError = function(err){
    if (!err) return err;
    if (err.message.indexOf("11000") != -1) return new Error("Username already exists!");
    return err;
  };

  module.exports = {
    open: function(callback) {
      console.log('Connecting to MongoDB...');
      Db.connect(mongoUrl, function(error, client) {
        db = client;
        callback(error, client);
      });
    },
    openRedis: function(callback){
      console.log('Connecting to Redis ' + envRedisHost + " " + envRedisPort);
      var redisClient = redis.createClient(envRedisPort, envRedisHost, null);
      redisClient.auth(envRedisPassword);
    },
    getSessionStore: function(express) {
      var redisStore = require("connect-redis")(express);
      return new redisStore(sessionStoreCredentials);
    },
    getAllLifts: function(name, query, limit, callback) {
      db.collection(name).find(query).sort({
        lift_date: -1
      }).limit(limit).toArray(callback);

    },
    find: function(name, query, limit, callback) {
      db.collection(name).find(query).sort({
        _id: -1
      }).limit(limit).toArray(callback);
    },
    findOne: function(name, query, callback) {
      db.collection(name).findOne(query, callback);
    },
    findDistinct: function(name, field, query, callback) {
      db.collection(name).distinct(field, query, callback);
    },
    insert: function(name, items, callback) {
      db.collection(name).insert(items, callback);
    },
    insertOne: function(name, item, callback) {
      module.exports.insert(name, item, function(err, items) { 
        callback(prettifyMongodbError(err), items ? items[0] : null);
      });
    },

    push: function(name, id, updateQuery, callback) {
      db.collection(name).update({
        _id: id
      }, {
        $push: updateQuery
      }, {
        safe: true
      }, callback);
    },
    pushWithUsername: function(name, username, updateQuery, callback) {
      db.collection(name).update({
        username: username
      }, {
        $push: updateQuery
      }, {
        safe: true
      }, callback);
    },
    pullWithUsername: function(name, username, updateQuery, callback) {
      console.log(updateQuery);
      db.collection(name).update({
        username: username
      }, {
        $pull: updateQuery
      }, {
        safe: true
      }, callback);
    },
    findAndRemove: function(name, query, callback) {
      db.collection(name).remove(query, {
        safe: true
      }, callback);
    }
  }
})();