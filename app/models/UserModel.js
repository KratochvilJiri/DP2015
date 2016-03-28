var mongoose = require('mongoose');

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
        type: String
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
    participantions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant'
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