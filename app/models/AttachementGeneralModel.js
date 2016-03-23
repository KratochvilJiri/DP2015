var mongoose = require('mongoose');

// attachement general(type) model
module.exports = mongoose.model('AttachementGeneral',{
	name: {
        type: String, 
        required: true, 
        unique: true
    },
	deadline: {
        type: Date, 
        required: true
    },
    description: {
        type: String
    },
    conference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        required: true
    }
});