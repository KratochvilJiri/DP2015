var mongoose = require('mongoose');
var AttachementTypeStructure = require('./AttachementTypeStructure');
var SponsorshipLevelStructure = require('./SponsorshipLevelStructure'); 

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
    notification: {
        type: String
    },
    active: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true  
    },
    invitation: {
        type: String,
    },
    attendeNumber: {
        type: Number,  
    },
    sponsorshipLevels: 
        [SponsorshipLevelStructure],
    attachementTypes: 
        [AttachementTypeStructure],
    participations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participation'
    }]
});