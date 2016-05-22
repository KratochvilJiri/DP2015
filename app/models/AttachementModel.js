/* Autor: Jiri Kratochvil 
   Nástroj pro podporu komunikace externích účastníků akce (diplomová práce)
*/

var mongoose = require('mongoose');

// attachement model
module.exports = mongoose.model('Attachement', {
    date: {
        type: Date,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    participation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participation',
        required: true
    },
    hash: {
        type: String
    }
});