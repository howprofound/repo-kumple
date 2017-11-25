const mongoose = require("mongoose")


var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	lastLogin: {
		type: Date,
		default: Date.now()
	},
	email: {
		type: String,
		required: true
	},
	avatar: {
		type: String,
		default: "basic-avatar.jpg"
	},
	firstName: String,
	lastName: String,
	bio: String
});

UserSchema.methods.validPassword = function(password) {
    return password === this.password
};

module.exports = mongoose.model('User', UserSchema, 'User')