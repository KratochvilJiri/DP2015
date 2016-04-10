var mongoose = require('mongoose');

// attachement general(type) model
module.exports = mongoose.model('Attachement',{
	date: {
        type: Date, 
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    participation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participation',
        required: true 
    },
    hash: {
        type: String
    }
});