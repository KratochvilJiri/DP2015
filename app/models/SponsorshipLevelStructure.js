var mongoose = require('mongoose');
var attachementTypeStructure = require('./AttachementTypeStructure');


// attendee model
module.exports = {
	name: {
        type: String,  
        required: true
    },
    value: {
        type: Number
    },
    attachementTypes: 
        [attachementTypeStructure]
};