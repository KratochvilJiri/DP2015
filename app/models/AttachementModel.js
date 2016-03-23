var mongoose = require('mongoose');

// attachement general(type) model
module.exports = mongoose.model('Attachement',{
	date: {
        type: Date, 
        required: true
    },
    data: {
        type: Buffer,
        required: true
    },
    participation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participation',
        required: true 
    }
});