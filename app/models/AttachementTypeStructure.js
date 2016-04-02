var mongoose = require('mongoose');

// attachement general(type) model
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
    }
};