var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;
var crypto = require('crypto');
db.on('error', console.error.bind(console, 'connection error:'));
//User schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	avatar: {
		type: String
	}
});
var User = mongoose.model('User', UserSchema);
module.exports = User;
module.exports.createUser = function(newUser, callback) {
	newUser.save(callback);
}
module.exports.getByUsername = function(username, callback) {
	User.findOne({username: username}, function(err, user) {
		callback(err, user);
	})
}
module.exports.isValidPassword = function(user, password) {
	var pass = crypto.createHash("md5").update(password).digest('hex');
	if(user.password === pass) {
		return true;
	} else {
		return false;
	}
}
module.exports.getById = function(id, callback) {
	User.findById(id, callback);
}