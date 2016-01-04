var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register', {'title': 'register'});
});
router.get('/login', function(req, res, next) {
  res.render('login', {'title': 'register'});
});
router.post('/register', function(req, res, next) {
	//get form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody('name', 'name is required').notEmpty();
	req.checkBody('email', 'email is required').notEmpty();
	req.checkBody('email', 'email is not valid').isEmail();
	req.checkBody('username', 'username is required').notEmpty();
	req.checkBody('password', 'password is required').notEmpty();
	req.checkBody('password2', 'password confirmation is required').notEmpty();
	req.checkBody('password2', 'passwords do not match').equals(password);

	var errors = req.validationErrors();
	if(errors) {
		res.render('register', {errors: errors});
	} else {
		var multerFile = req.file;
		if(multerFile) {
			var avatar = multerFile.filename;
			res.end('file uploaded')
		} else {
			var avatar = "noAvatar.jpg";
			res.end('no file');
		}
		password = crypto.createHash("md5").update(password).digest('hex');
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			avatar: avatar
		});
		User.createUser(newUser, function(err, user) {
			if(err) {
				throw err;
			}
			console.log(user);
		});
	}
});
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
		function(username, password, callback) {
			User.getByUsername(username, function(err, user) {
				if(err) throw err;
				if(!user) {
					console.dir("no user found");
					return callback(null, false, {message: 'no user was found'});
				}
				if(!User.isValidPassword(user, password)) {
					return callback(null, false, {message: 'Incorrect password'});
				}
				console.log(user);
				return callback(null, user);
			});

		}
	));
router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/users/login'
}))

module.exports = router;
