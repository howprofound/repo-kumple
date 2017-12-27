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
		default: "default.jpg",
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	bio: String
});

UserSchema.methods.validPassword = function(password) {
    return password === this.password
};

module.exports = mongoose.model('User', UserSchema, 'User')