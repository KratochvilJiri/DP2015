var mongoose = require('mongoose');

// address structure
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