/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/

var mongoose = require('mongoose');
var AddressStructure = require('./AddressStructure');

// user model
module.exports = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMINISTRATOR', 'CONTACT_PERSON', 'PARTICIPANT'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    ICO: {
        type: Number
    },
    DIC: {
        type: Number
    },
    address: {
        type: AddressStructure
    },
    contactPerson: {
        type: String
    },

    participations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participantion'
    }],
    assignedIssues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue'
    }],
    createdIssues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue'
    }]
});