var mongoose = require('mongoose');
var SponsorshipLevelStructure = require('./SponsorshipLevelStructure'); 

// attendee model
module.exports = mongoose.model('Participation', {
    state: {
        type: String,
        enum: ['CANCELLED', 'APPROVED', 'COMPLETE', 'CONTRACT_IN_PROGRESS', 'CONTRACT_SIGNED'],
        required: true
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
    communicationSummary: {
        type: String
    },
    donationValue: {
        type: Number
    },
    sponsorshipLevel: SponsorshipLevelStructure,
    conference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        require: true
    },
    atendees: [{
        type: String,
    }],
    attachements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachement'
    }]

});