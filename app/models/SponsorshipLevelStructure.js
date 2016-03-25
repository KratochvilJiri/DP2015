var mongoose = require('mongoose');
var attachementTypeStructure = require('./AttachementGeneralStructure');


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