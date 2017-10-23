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
	}
});

UserSchema.methods.validPassword = function(password) {
    return password === this.password
};

module.exports = mongoose.model('User', UserSchema, 'User')