'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
  liftingLib = require('./lib/lifting-lib'),
  routes = require('./routes/lifting-routes'),
  db = require('./lib/db'),
  http = require('http'),
  https = require('https'),
  fs = require('fs'),
  path = require('path');

// Instantiate a new Express application
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set("jsonp callback", true);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieParser('swolepatrol'));
app.use(express.session({
  secret: 'swolepatrol',
  store: liftingLib.getSessionStore()
}));
app.use(app.router);
app.use(require('less-middleware')({
  src: __dirname + '/public'
}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('local' == app.get('env') || true) {
  app.use(express.errorHandler());
}

//app.get('/', routes.getIndex);
// app.get('/users', user.list);
app.get('/test', function(req, res) {
  res.jsonp("hello");
});

app.get('/api/user/new', liftingLib.basicApiAuth, routes.signup);
app.get('/api/user/:username', liftingLib.basicApiAuth, routes.getUser);

app.get('/api/user/:username/workouts', liftingLib.basicApiAuth, routes.getAllLifts);

app.get('/api/user/:username/liftnames', liftingLib.basicApiAuth, routes.getAllLiftNames);
app.get('/api/user/:username/liftnames/new', liftingLib.basicApiAuth, routes.addNewLiftName);
app.get('/api/user/:username/liftnames/delete', liftingLib.basicApiAuth, routes.deleteLiftName);

app.get('/api/user/:username/musclegroups', liftingLib.basicApiAuth, routes.getAllMuscleGroups);
//app.get('/api/user/:username/musclegroups/new', liftingLib.basicApiAuth, routes.addNewMuscleGroup);

app.get('/api/user/:username/lifts', liftingLib.basicApiAuth, routes.getAllLifts);
//app.get('/api/user/:username/lifts/:liftid', liftingLib.basicApiAuth, routes.getSingleLift);
//app.post('/api/user/:username/lifts/new', routes.addNewLift);


http.createServer(app).listen(app.get('port'), function() {
  console.log('LiftingAPI server listening on port ' + app.get('port'));
  console.log('LiftingAPI is in the ' + process.env['NODE_ENV'] + ' environment.')
  liftingLib.openDatabase(function(error, client) {
    if (error) console.log('There was a problem opening the database: ' + error);
    else console.log('NodeDog databases all good. Woof.');
  });
  console.log(liftingLib.generateNewApiKey());
});