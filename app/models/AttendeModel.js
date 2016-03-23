var mongoose = require('mongoose');

// attendee model
module.exports = mongoose.model('Attendee',{
	name: {
        type: String, 
        required: true
    },
    participation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participation',
        required: true
    }
});