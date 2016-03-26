var mongoose = require('mongoose');
var AtachementTypeStructure = require('./AtachementTypeStructure');
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
        type: Number
    },
    active: {
        type: Boolean,
        required: true
    },
    sponsorshipLevels: 
        [SponsorshipLevelStructure],
    attachementTypes: 
        [AtachementTypeStructure],
    participations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participation'
    }]
});