var liftingLib = require('../lib/lifting-lib');

module.exports = {

  getUser: function(req, res) {
    liftingLib.getUser(req.params.username, function(err, user) {
      if (err) res.jsonp(400, {error: err.message});
      //if (user) res.json(user);

      else res.jsonp(user);
    });
  },

  getAllLifts: function(req, res) {
    console.log("Getting all lifts for user " + req.params.username);
    liftingLib.getAllLifts(req.params.username, function(err, lifts) {
      if (lifts) {
        res.jsonp(lifts);
      } else res.send('0');
    });
  },
  getSingleLift: function(req, res) {
    console.log("Getting lift number " + req.params.liftid + " for user " + req.params.username);
    liftingLib.getSingleLift(req.params.username, req.params.liftid, function(err, lift) {
      if (lift) res.jsonp(lift);
      else res.send('0');
    });
  },
  getAllLiftNames: function(req, res) {
    console.log(req.session.marco);
    console.log("Getting all lift names for user " + req.params.username);
    liftingLib.getAllLiftNames(req.params.username, function(err, liftnames) {
      if (liftnames) res.jsonp(liftnames);
      else res.send('0');
    });
  },
  addNewLiftName: function(req, res) {
    //if (req.xhr) {

    liftingLib.addNewLiftName(req.params.username, req.body.newLiftName, req.body.muscleGroup, function(err, liftname) {
      console.log("ERROR: " + err);
      if (err) res.jsonp(400, {error: err.message});
      else res.jsonp(liftname);
    });
    //}
    
  },

  deleteLiftName: function(req, res) {
    //if (req.xhr) {
    liftingLib.deleteLiftName(req.params.username, req.body.liftName, req.body.muscleGroup, function(err, liftname) {
      if (err) res.jsonp(400, err);
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
    liftingLib.addNewLift(req.params.username, req.body.newLift, function(err, lift) {
      if (err) res.jsonp(400, {error: err.message});
      else res.jsonp(lift);
    });
    //}
  },

  deleteLift: function(req, res) {
    //if (req.xhr) {
      console.log('Deleting lift ' + req.params.liftid);
    liftingLib.deleteLift(req.params.username, req.params.liftid, function(err, lift) {
      if (err) res.jsonp(400, {error: err.message});
      else res.jsonp(lift);
    });
    //}
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
    liftingLib.createUser(req.body.username, req.body.email, req.body.password, function(err, user) {
      if (err) res.jsonp(400, {error: err.message});
      else res.jsonp(user);
    });
  }
}