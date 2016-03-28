var mongoose = require('mongoose');

// attachement general(type) model
module.exports = {
	city: {
        type: String, 
    },
	country: {
        type: String,
    },
    street: {
        type: String
    },
    postal: {
        type: String
    }
};