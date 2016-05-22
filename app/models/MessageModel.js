/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce) 2016
*/


var mongoose = require('mongoose');

// message model
module.exports = mongoose.model('Message', {
    date: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seen: {
        type: Boolean,
        required: true
    },
    issue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue'
    },
    participation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participation'
    }
});