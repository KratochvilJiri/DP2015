var mongoose = require('mongoose');

// attachement model
module.exports = {
	name: {
        type: String, 
        required: true
    },
	date: {
        type: Date, 
        required: true
    },
    description: {
        type: String
    },
    hash: {
        type: String
    }
};