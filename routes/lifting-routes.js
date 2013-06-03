var liftingLib = require('../lib/lifting-lib');

module.exports = {

  getUser: function(req, res) {
    console.log("Username: " + req.params.username);
    liftingLib.getUser(req.params.username, function(err, user) {
      if (user) res.json(user);
      else res.json('0');
    });
  },

  getAllLifts: function(req, res) {
    console.log("Getting all lifts for user " + req.params.username);
    liftingLib.getAllLifts(req.params.username, function(err, lifts) {
      if (lifts) {
        req.session.marco = 'polo';
        res.jsonp(lifts);
      } else res.send('0');
    });
  },
  getSingleLift: function(req, res) {
    console.log("Getting lift number " + req.params.liftid + " for user " + req.params.username);
    liftingLib.getSingleLift(req.params.username, req.params.liftid, function(err, lift) {
      if (lift) res.send(lift);
      else res.send('0');
    });
  },
  getAllLiftNames: function(req, res) {
    console.log(req.session.marco);
    console.log("Getting all lift names for user " + req.params.username);
    liftingLib.getAllLiftNames(req.params.username, function(err, liftnames) {
      if (liftnames) res.send(liftnames);
      else res.send('0');
    });
  },
  addNewLiftName: function(req, res) {
    //if (req.xhr) {
    liftingLib.addNewLiftName(req.params.username, req.body.newLiftName, req.body.muscleGroup, function(err, liftname) {
      console.log("Adding new lift name " + req.body.newLiftName + " into muscle group " + req.body.muscleGroup);
      if (err) res.jsonp(err);
      else res.jsonp(liftname);
      console.log(liftname);
    });
    //}
    
  },

  deleteLiftName: function(req, res) {
    //if (req.xhr) {
    liftingLib.deleteLiftName(req.params.username, req.body.liftName, req.body.muscleGroup, function(err, liftname) {
      console.log("Removing lift name " + req.body.liftName + " from muscle group " + req.body.muscleGroup);
      if (err) res.jsonp(err);
      else res.jsonp(liftname);
      console.log(liftname);
    });
    //}
    
  },


  getAllMuscleGroups: function(req, res) {
    console.log("Getting all muscle groups for user " + req.params.username);
    liftingLib.getAllMuscleGroups(req.params.username, function(err, musclegroups) {
      if (musclegroups) res.send(musclegroups);
      else res.send('0');
    });
  },

  addNewLift: function(req, res) {
    //if (req.xhr) {
    liftingLib.addNewLift(req.params.username, req.body.newlift, function(err, lift) {
      console.log(lift);
      res.send(err);
    });
    //}
    res.send(lift);
  },


  // addStock: function(req, res) {
  //   if (req.xhr) {
  //     nocklib.addStock(req.session._id, req.body.stock, function(err, price) {res.send(price);});
  //   }
  // },

  getIndex: function(req, res) {
    res.render('index');
  },

  // getUser: function(req, res) {
  //   nocklib.getUser(req.params.username, function(err, user) {
  //     if (user)
  //       res.send('1');
  //     else
  //       res.send('0');
  //   });
  // },

  // portfolio: function(req, res) {
  //   nocklib.getUserById(req.session._id, function(err, user) {
  //   var portfolio = [];
  //   if (user && user.portfolio) portfolio = user.portfolio;
  //   nocklib.getStockPrices(portfolio, function(err, prices) {
  //     res.render('portfolio', {portfolio:portfolio, prices:prices});
  //   });
  // });
  // },

  // login: function(req, res) {
  //   nocklib.authenticate(req.body.username, req.body.password, function(err, id) {
  //     if (id) {
  //       req.session._id = id;
  //       req.session.username = req.body.username;
  //       res.redirect('/portfolio');
  //     }
  //     else
  //       res.redirect('/');
  //   });    

  // },

  signup: function(req, res) {
    console.log('Trying to create user as: ' + req.body.username + " : " + req.body.password);
    liftingLib.createUser(req.body.username, req.body.email, req.body.password, function(err, user) {
      if (err) res.jsonp(400, {error: err.message});
      else res.jsonp(user);
    });
  }
}