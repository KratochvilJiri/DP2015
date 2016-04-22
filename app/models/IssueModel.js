var mongoose = require('mongoose');

// issue model
module.exports = mongoose.model('Issue', {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    state: {
        constant: {
            type: String,
            enum: ['DONE', 'IN_PROGRESS'],
            required: true
        },
        color: {
            type: String
        },
        text: {
            type: String
        }
    },
    type: {
        constant: {
            type: String,
            enum: ['SYS_ERR', 'QUESTION', 'IMPROVEMENT_SUGG'],
            required: true
        },
        color: {
            type: String
        },
        text: {
            type: String
        }
    },
    priority: {
        constant: {
            type: String,
            enum: ['LOW', 'NORMAL', 'HIGH'],
            required: true },
        color: {
            type: String
        },
        text: {
            type: String
        }
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
});