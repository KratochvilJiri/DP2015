var mongoose = require('mongoose');

// attendee model
module.exports = mongoose.model('SponsorshipLevel',{
	name: {
        type: String,  
        required: true
    },
    value: {
        type: Number
    },
    participations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participation'  
    }],
    conference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        required: true
    }
});