var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;
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