var mongoose = require('mongoose');

// user model
module.exports = mongoose.model('User',{
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	role: {type: String, enum: ['ADMINISTRATOR', 'CONTACT_PERSON', 'PARTICIPANT'], required: true},
	name: {type: String, required: true},
	phone: {type: String}
});