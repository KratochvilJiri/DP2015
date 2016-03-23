var mongoose = require('mongoose');

// message model
module.exports = mongoose.model('Message',{
	date: {
        type: Date, 
        required: true
    },
    content: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue'
    },
    participation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participation'
    }
});