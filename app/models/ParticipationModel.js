/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

var mongoose = require('mongoose');
var SponsorshipLevelStructure = require('./SponsorshipLevelStructure');
var Attendee = require('./AttendeeStructure');

// participation model
module.exports = mongoose.model('Participation', {
    state: {
        type: String,
        enum: ['INVITED', 'CANCELLED', 'APPROVED', 'COMPLETE', 'CONTRACT_IN_PROGRESS', 'CONTRACT_SIGNED'],
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
    sponsorshipLevel: {
        value: Number,
        type: SponsorshipLevelStructure
    },
    conference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        require: true
    },
    attendees: [Attendee],
    attachements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachement'
    }]

});