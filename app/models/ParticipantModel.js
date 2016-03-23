var mongoose = require('mongoose');

// attendee model
module.exports = mongoose.model('Participant',{
	name: {
        type: String, 
        required: true
    },
    ICO: {
        type: String
    },
    DIC: {
        type: String
    },
    address: {
        type: String
    },
    contactName: {
        type: String
    },
    contactPhone: {
        type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true  
    },
    participations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participation',
        required: true
    }]
});