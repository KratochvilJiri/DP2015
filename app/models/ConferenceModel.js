var mongoose = require('mongoose');

// attachement general(type) model
module.exports = mongoose.model('Conference',{
	name: {
        type: String, 
        required: true
    },
	date: {
        type: Date, 
        required: true
    },
    place: {
        type: String
    },
    description: {
        type: String
    },
    active: {
        type: Boolean
    },
    sponsorshipLevels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SponsorshipLevel',
        required: true
    }],
    participations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participation',
        require: true
    }],
    attachementTypes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AttachementGeneral',
        required: true
    }]
});