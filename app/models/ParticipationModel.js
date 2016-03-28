var mongoose = require('mongoose');

// attendee model
module.exports = mongoose.model('Participation',{
	state: {
        type: String,  
        enum: ['CANCELLED', 'APPROVED', 'COMPLETE', 'CONTRACT_IN_PROGRESS', 'CONTRACT_SIGNED'],
        required: true
    },
    type: {
        type: String,  
        enum: ['SPONSOR', 'PARTICIPANT'],
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message' 
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sponsorshipLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SponsorshipLevel'
    },
    conference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        require: true
    },
    atendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Atendee'
    }],
    attachements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachement'
    }]
    
});