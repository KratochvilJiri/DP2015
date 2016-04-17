var mongoose = require('mongoose');

// issue model
module.exports = mongoose.model('Issue',{
	name: {
        type: String, 
        required: true
    },
	description: {
        type: String, 
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    state: {
        type: String,  
        enum: ['DONE', 'IN_PROGRESS'], 
        required: true
    },
    type: {
        type: String,
        enum: ['SYS_ERR', 'QUESTION', 'IMPROVEMENT_SUGG'],
        required: true  
    },
    priority: {
        type: String,
        enum: ['LOW', 'NORMAL', 'HIGH'],
        required: true  
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
     messages: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Message'
     }]
});