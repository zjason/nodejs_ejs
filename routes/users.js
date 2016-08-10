var express = require('express');
var router = express.Router();

/* GET users detail page and account overview. */
router.get('/:userid', function(req, res, next) {
  var userid = req.params.userid;
  if (req.session.userid){
    if (req.session.userid == userid ) {
      return res.render('users', {title: 'YoungFlow', user_status: "<a href='/logout'> Logout</a>"});
    }
  }
  return res.status(404).send('Sorry, page not found!');
});

module.exports = router;
