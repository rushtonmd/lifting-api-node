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
if ('local' == app.get('env')) {
  app.use(express.errorHandler({
    showStack: true,
    dumpExceptions: true
  }));
} else {
  app.use(function(err, req, res, next) {
    res.status(500);
    res.render('500');
  });

}

//app.get('/', routes.getIndex);
// app.get('/users', user.list);
app.get('/marco', liftingLib.basicApiAuth, function(req, res) {
  res.jsonp("polo");
});

app.post('/api/users/new', liftingLib.basicApiAuth, routes.signup);
app.get('/api/users/:username', liftingLib.basicApiAuth, routes.getUser);

app.get('/api/users/:username/workouts', liftingLib.basicApiAuth, routes.getAllLifts);

app.get('/api/users/:username/liftnames', liftingLib.basicApiAuth, routes.getAllLiftNames);
app.post('/api/users/:username/liftnames/new', liftingLib.basicApiAuth, routes.addNewLiftName);
app.del('/api/users/:username/liftnames/:liftnameid', liftingLib.basicApiAuth, routes.deleteLiftName);

app.get('/api/users/:username/musclegroups', liftingLib.basicApiAuth, routes.getAllMuscleGroups);
//app.get('/api/user/:username/musclegroups/new', liftingLib.basicApiAuth, routes.addNewMuscleGroup);

app.get('/api/users/:username/lifts', liftingLib.basicApiAuth, routes.getAllLifts);
app.get('/api/users/:username/lifts/:liftid', liftingLib.basicApiAuth, routes.getSingleLift);
app.post('/api/users/:username/lifts/new', liftingLib.basicApiAuth, routes.addNewLift);
app.del('/api/users/:username/lifts/:liftid', liftingLib.basicApiAuth, routes.deleteLift);

app.get('*', function(req, res) {
  res.status(404);
  res.render('404');
});


http.createServer(app).listen(app.get('port'), function() {
  console.log('LiftingAPI server listening on port ' + app.get('port'));
  console.log('LiftingAPI is in the ' + process.env['NODE_ENV'] + ' environment.')
  liftingLib.openDatabase(function(error, client) {
    if (error) console.log('There was a problem opening the database: ' + error);
    else console.log('LiftingAPI databases all good. Boss.');
  });
  console.log(liftingLib.generateNewApiKey());
});