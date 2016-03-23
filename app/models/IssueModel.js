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
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
     messages: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Message',
       required: true  
     }]
});