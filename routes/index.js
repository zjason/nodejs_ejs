var express = require('express');
var router = express.Router();

// for password encrypted
var bcrypt = require('bcrypt');
const saltRounds = 10;

// connect to mongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

// check mongoDB status
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

// create schema
var youngFSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: String,
  password: String,
  Contract_info: String,
  avatar: {
    data: Buffer,
    contentType: String,
  },
  rooms: [{
    zipcode: String,
    landmark: String,
    price: Number,
    room_images: [{
      data: Buffer,
      contentType: String,
    }],
    long_term: Boolean,
    post_data: {type: Date, default: Date.now}
  }],
  items:[{
    item_name: String,
    description: String,
    price: Number,
    item_images: [{
      data: Buffer,
      contentType: String
    }],
  }]
});

var youngFModel = mongoose.model("youngFModel", youngFSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  youngFModel.find({}, 'username' ,function (err, user){
    var rd = user;
    console.log(rd);

    if (req.session.username){
      res.render('index', { title: 'YoungFlow', user_status: "<a href='" + "/users/" + req.session.userid + "'>" + req.session.username+"</a>", roomdata: rd });
    }else{
      res.render('index', { title: 'YoungFlow', user_status: "<a class='page-scroll' href='' data-toggle='modal' data-target='#myModal' id='status'>Login</a>", roomdata: rd });
    }
  });
});

/* POST signup action  */
router.post('/signup', function (req, res) {
  youngFModel.findOne({email: req.body.email}, function (err, user) {
    if (user) {
      res.send("email already exist!");
      return;
    }else{
      var newUser = new youngFModel(req.body);
      var hash = bcrypt.hashSync(req.body.password, saltRounds);
      newUser.password = hash;
      console.log(newUser);
      newUser.save(function (err, user) {
        if (err){
          console.log("could not save newly added user" + err);
        }else{
          req.session.username = newUser.username;
          req.session.userid = newUser.id;
          res.redirect('/');
        }
      });
    }
  });
});

/* POST signin action  */
router.post('/signin', function(req, res){
  youngFModel.findOne({email: req.body.email}, function (err, user) {
    console.log(req.body.password);
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.username = user.username;
        req.session.userid = user.id;
        res.redirect('/');
        return;
      }else{
        res.send("email or password is wrong!");
        return;
      }
    }else{
      res.send("email or password is wrong!");
      return;
    }
  });
});

/* GET logout action  */
router.get('/logout', function (req,res) {
  if (req.session.username) {
   req.session.flush();
    res.redirect('/');
  }

});

module.exports = router;
